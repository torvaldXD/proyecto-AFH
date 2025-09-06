const Tool = require("../models/tools");

const Codes = require("../models/codetool");
const Files = require("../models/files");
const moment = require("moment/moment");
const History = require("../models/historyinventory");

module.exports.getAllTools = (req, res) => {
  try {
    Tool.find({}).exec(function (error, result) {
      if (error) {
        res.send({
          success: false,
          message: "The tools not found",
        });
      } else {
        res.send({
          success: true,
          message: "sucessfull",
          docs: result,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllCodes = (req, res) => {
  try {
    Codes.find({}).exec(function (error, result) {
      if (error) {
        res.send({
          success: false,
          message: "The tools not found",
        });
      } else {
        res.send({
          success: true,
          message: "sucessfull",
          docs: result,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getTool = (req, res) => {
  Tool.find({ _id: req.params.id }).exec(function (err, result) {
    try {
      if (result[0]) {
        res.send({ success: true, tool: result[0] });
      }
    } catch (err) {
      res.send({ succes: false, message: "Tool not found" });
    }
  });
};

module.exports.deleteTool = function (req, res) {
  Tool.findByIdAndRemove({ _id: req.params.id }).exec(function (err, doc) {
    if (err) {
      res.json({
        success: false,
        message: "something happened in the database",
      });
    } else {
      // console.log(doc);
      // Codes.findOneAndRemove({code:doc.codeTool}).exec()
      console.log("se elimino la herramienta", doc);
      res.status(200).json({
        success: true,
        message: "Tool deleted successfully",
        tool: doc,
      });
    }
  });
};

module.exports.updateTool = (req, res) => {
  // console.log(req.body.tool);

  // if(req.body.tool.inCharge === "" && req.body.tool.departureDate === 'Invalid date' && req.body.tool.admissionDate === 'Invalid date'){
  //   if(req.body.tool.status === "INACTIVA"){
  //     console.log("estaria INACTIVA");
  //     state= 'INACTIVA'
  //   }else{
  //     state= "ACTIVA"
  //     console.log("estaria ACTIVA");
  //   }
  // }
  Tool.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.tool.name,
        brand: req.body.tool.brand,
        codeTool: req.body.tool.codeTool,
        inCharge: req.body.tool.inCharge,
        departureDate: req.body.tool.departureDate,
        admissionDate: req.body.tool.admissionDate,
        status: req.body.tool.status,
        image: req.body.tool.image,
      },
    }
  ).exec(function (err, result) {
    try {
      if (err) {
        res.json({ success: false, message: "Tool not found" });
      } else {
        console.log("se actualizo la herramienta", result);
        let data = {};
        if (
          req.body.tool.incharge !== "" &&
          req.body.tool.departureDate !== "Invalid date" &&
          req.body.tool.admissionDate !== "Invalid date"
        ) {
          data = {
            type: "Salida",
            typeItem: "Herramienta",
            item: req.body.tool.codeTool,
            date: moment(new Date()).format("DD/MM/YYYY"),
            dateShop: "",
            amount: 0,
            dateInside: req.body.tool.admissionDate,
            dateOutside: req.body.tool.departureDate,
            employee: req.body.tool.incharge,
            proyect: "",
            idBill: "",
          };
        } else {
          data = {
            type: "Entrada",
            typeItem: "Herramienta",
            item: req.body.tool.codeTool,
            date: moment(new Date()).format("DD/MM/YYYY"),
            dateShop: "",
            amount: 0,
            dateInside: moment(new Date()).format("DD/MM/YYYY"),
            dateOutside: result.departureDate,
            employee: "",
            proyect: "",
            idBill: "",
          };
        }
        const history = new History(data);
        history.save(function (err, billBD) {
          if (err) {
            console.log(err);
          }
          res.status(200).json({ success: true, message: "Tool updated successfully" });
        });
      }
    } catch (error) {
      console.log("Error generate:", error);
    }
  });
};

module.exports.createTool = (req, res) => {
  try {
    //search tool if exists
    Tool.find({ codeTool: req.body.tool.codeTool }).exec(function (
      err,
      result
    ) {
      if (result[0]) {
        res.status(200).json({
          success: true,
          message: "Tool already exists in BD",
        });
      } else {
        //instantiation of a new user and encryptation password
        const tool = new Tool({
          name: req.body.tool.name,
          codeTool: req.body.tool.codeTool,
          brand: req.body.tool.brand,
          image: req.body.tool.image,
        });

        //save the user create into the DB
        tool.save(function (err, toolDB) {
          if (err) {
            console.log("lanzo aqui", err);
          }
          const code = new Codes({ code: req.body.tool.codeTool });
          code.save(function (err, toolDB) {
            if (err) {
              console.log(err);
            }
            console.log("Guardo Code");
          });
          res.status(201).json({
            success: true,
            message: "Tool create sucessfull",
          });
        });
      }
    });
  } catch (error) {
    //handle errors
    console.log("error generado", error);
  }
};

module.exports.findByAutoComplete = function (req, res) {
  Tool.find({
    $or: [
      { name: { $regex: req.query.filters, $options: "i" } },
      { brand: { $regex: req.query.filters, $options: "i" } },
      { codeTool: { $regex: req.query.filters, $options: "i" } },
    ],
  }).exec(function (err, docs) {
    if (err) {
      console.info("filter query page: ", err);
      return res.json({
        success: false,
        message: "Something wrong in BD",
      });
    }
    res.json({
      success: true,
      docs,
    });
  });
};

module.exports.updateToolByHistory = (req, res) => {
  Tool.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        inCharge: req.body.tool.inCharge,
        departureDate: req.body.tool.departureDate,
        admissionDate: req.body.tool.admissionDate,
        status: req.body.tool.status,
      },
    }
  ).exec(function (err, result) {
    try {
      if (err) {
        res.json({ success: false, message: "Tool not found" });
      } else {
        console.log("se actualizo la herramienta", result);
        res
          .status(200)
          .json({ success: true, message: "Tool updated successfully" });
      }
    } catch (error) {
      console.log("Error generate:", error);
    }
  });
};

module.exports.findByPage = function (req, res) {
  const filters = JSON.parse(req.query.filters);
  // console.log("tools",filters);
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 100;
  limite = Number(limite);

  const query = {};

  if (filters.global && filters.global.value) {
    const regex = new RegExp(filters.global.value, "i");
    query["$or"] = [
      { status: regex },
      { codeTool: regex },
      { brand: regex },
      { name: regex },
    ];
  }

  Tool.find(query)
    .skip(desde)
    .limit(limite)
    .exec(function (err, resultBD) {
      if (err) {
        console.info(err);
        return res.json({
          success: false,
          err,
        });
      }
      Tool.countDocuments(query, function (err, count) {
        if (err) {
          console.info(err);
        }
        res.json({
          success: true,
          totalResults: count,
          docs: resultBD,
        });
      });
    });
};
