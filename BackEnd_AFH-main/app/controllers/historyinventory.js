const History = require("../models/historyinventory");

module.exports.createHistory = (req, res) => {
    console.log(req.body.history);
  try {
    //new history
    const history = new History({
    type: req.body.history.type ,
    typeItem: req.body.history.typeItem ,
    item: req.body.history.item ,
    date: req.body.history.date ,
    dateShop: req.body.history.dateShop ,
    amount: req.body.history.amount,
    dateInside: req.body.history.dateInside,
    dateOutside: req.body.history.dateOutside,
    employee: req.body.history.employee,
    proyect: req.body.history.proyect,
    idBill:req.body.history.idBill
    });
    //save the client create into the DB
    history.save(function (err, billBD) {
      if (err) {
        console.log(err);
      }
      res.status(201).json({
        success: true,
        message: "History create sucessfull",
      });
    });
  } catch (error) {
    //handle errors
    console.log(error);
  }
};

module.exports.getAllHistory = (req, res) => {
  try {
    History.find({}).exec(function (error, result) {
      if (error) {
        res.send({
          success: false,
          message: "The histories not found",
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

module.exports.deleteHistory = function (req, res) {
  History.findByIdAndRemove({ _id: req.params.id }).exec(function (err, doc) {
    if (err) {
      res.json({
        success: false,
        message: "something happened in the database",
      });
    } else {
      console.log("se elimino el historial",doc);
      res.status(200).json({
        success: true,
        message: "History deleted successfully",
        history:doc
      });
    }
  });
};

module.exports.findByPage = function(req, res) {
  const filters = JSON.parse(req.query.filters);
  // console.log("history",filters);
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 100;
  limite = Number(limite);

  const query = {};

  if (filters.global && filters.global.value) {
    const regex = new RegExp(filters.global.value, "i");
    query["$or"] = [
      { item: regex },
      { date: regex },
      { typeItem: regex },
      { type: regex }
    ];
  }

  History.find(query)
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
      History.countDocuments(query, function(err, count) {
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