const Supply = require("../models/supplies");
const History = require("../models/historyinventory");
const moment = require("moment/moment");

module.exports.getSupplies = (req, res) => {
  try {
    Supply.find({}).exec(function (error, result) {
      if (error) {
        res.send({
          success: false,
          message: "something happened in the database",
        });
      } else {
        res.send({ success: true, docs: result });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteSupply = function (req, res) {
  Supply.findByIdAndRemove({ _id: req.params.id }).exec(function (err, doc) {
    if (err) {
      res.json({
        success: false,
        message: "something happened in the database",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Supply deleted successfully",
      });
    }
  });
};

module.exports.getSupply = (req, res) => {
  Supply.find({ _id: req.params.id }).exec(function (err, result) {
    try {
      if (result[0]) {
        res.send({ success: true, supply: result[0] });
      }
    } catch (err) {
      res.send({ succes: false, message: "Supply not found" });
    }
  });
};

module.exports.createSupply = (req, res) => {
  try {
    //search tool if exists
    Supply.find({ description: req.body.supply.description }).exec(function (
      err,
      result
    ) {
      if (result[0]) {
        res.status(200).json({
          success: true,
          message: "Supply already exists in BD",
        });
      } else {
        var status;
        let rangeMax = parseInt(req.body.supply.maxRange)
        let amountFront = parseInt(req.body.supply.amount);

        // console.log("minimo:"+rangeMin+"cantidad"+amountFront+"maximo:"+rangeMax);
        if(amountFront < 1 ){
          status = 'SIN EXISTENCIA';
        } else if(amountFront > 1 && amountFront<rangeMax){
          status = 'POCA EXISTENCIA';
        } else if(amountFront>=rangeMax){
          status = 'EN EXISTENCIA';
        }
        const supply = new Supply({
          name: req.body.supply.name,
          description: req.body.supply.description,
          minRange: req.body.supply.minRange,
          amount: req.body.supply.amount,
          maxRange: req.body.supply.maxRange,
          unit: req.body.supply.unit,
          inventoryStatus: status,
        });

        //save the supplie create into the DB
        supply.save(function (err, toolDB) {
          if (err) {
            console.log("lanzo aqui", err);
          }
          res.status(201).json({
            success: true,
            message: "Supply create sucessfull",
          });
        });
      }
    });
  } catch (error) {
    //handle errors
    console.log("error generado", error);
  }
};

module.exports.updateSupply = (req, res) => {
  Supply.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.supply.name,
        description: req.body.supply.description,
        minRange: req.body.supply.minRange,
        amount: req.body.supply.amount,
        maxRange: req.body.supply.maxRange,
        unit: req.body.supply.unit,
        inventoryStatus: req.body.supply.inventoryStatus,
      },
    }
  ).exec(function (err, result) {
    try {
      if (err) {
        res.json({ success: false, message: "Supply not found" });
      } else {
        // console.log("se actualizo el sumistro", result);
        let data={};
        History.findOne({item: req.body.supply.name }).exec(function (err,bd) {
          if(err){
            console.log("bill not found");
          }
          if(req.body.supply.amount>result.amount){
            data={
              type: "Entrada" ,
              typeItem: "Suministro" ,
              item: result.name,
              date: moment(new Date()).format("DD/MM/YYYY"),
              dateShop: moment(new Date()).format("DD/MM/YYYY") ,
              amount: req.body.supply.amount - result.amount ,
              dateInside: "",
              dateOutside: "",
              employee: "",
              proyect: "",
              idBill: bd.idBill || ""
              }
          }
          if(req.body.supply.amount < result.amount){
            data={
              type: "Salida" ,
              typeItem: "Suministro" ,
              item: result.name,
              date: moment(new Date()).format("DD/MM/YYYY"),
              dateShop: "" ,
              amount: result.amount - req.body.supply.amount ,
              dateInside: "",
              dateOutside: "",
              employee: "",
              proyect: "",
              idBill: ""
              }
          }
          const history = new History(data);
            history.save(function (err, billBD) {
              if (err) {
                console.log(err);
              }
              res.status(200).json({ success: true, message: "Supply updated successfully" });
            });
        });
      }
    } catch (error) {
      console.log("Error generate:", error);
    }
  });
};

module.exports.findByAutoComplete = function(req, res) {
  Supply.find({
      $or: [
          { name: { $regex: req.query.filters, $options: "i" } },
          { description: { $regex: req.query.filters, $options: "i" } },
      ]
  }).exec(function(err, docs) {
      if (err) {
          console.info('filter query page: ', err);
          return res.json({
              success: false,
              message:"Something wrong in BD",
          });
      }
      res.json({
          success: true,
          docs
      });
  });
};

module.exports.findByPage = function(req, res) {
  const filters = JSON.parse(req.query.filters);
  // console.log("supplies",filters);
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 100;
  limite = Number(limite);

  const query = {};

  if (filters.global && filters.global.value) {
    const regex = new RegExp(filters.global.value, "i");
    query["$or"] = [
      { item: regex },
    ];
  }

  Supply.find(query)
    .skip(desde)
    .limit(limite)
    .exec(function(err, resultBD) {
      if (err) {
        console.info(err);
        return res.json({
          success: false,
          err
        });
      }
      Supply.countDocuments(query, function(err, count) {
        if (err) {
          console.info(err);
        }
        res.json({
          success: true,
          totalResults: count,
          docs: resultBD
        });
      });
    });
};
