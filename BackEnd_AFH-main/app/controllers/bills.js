const Bill = require("../models/bills");

module.exports.createBill = (req, res) => {
  try {
    //new client
    const bill = new Bill({
     provider: req.body.bill.provider,
     idBill: req.body.bill.idBill,
     price: req.body.bill.price,
     vat: req.body.bill.vat,
     retention: req.body.bill.retention === '' || req.body.bill.retention === null ? 0 : req.body.bill.retention,
     dateShop: req.body.bill.dateShop,
     total: req.body.bill.total
    });
    //save the client create into the DB
    bill.save(function (err, billBD) {
      if (err) {
        console.log(err);
      }
      res.status(201).json({
        success: true,
        message: "Bill create sucessfull",
      });
    });
  } catch (error) {
    //handle errors
    console.log(error);
  }
};


module.exports.findByAutoComplete = function(req, res) {
  Bill.find({
      $or: [
          { idBill: { $regex: req.query.filters, $options: "i" } },
          { provider: { $regex: req.query.filters, $options: "i" } },
          { dateShop: { $regex: req.query.filters, $options: "i" } },
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
  // console.log("bill",filters);
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
    ];
  }

  Bill.find(query)
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
      Bill.countDocuments(query, function(err, count) {
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

module.exports.getAllBills = (req, res) => {
  Bill.find({}).exec(function (err, result) {
    try {
      if (err) {
        res.send({ message: "Error generate in DB" });
      }
      res.send({ docs: result });
      return;
    } catch (error) {
      console.log("Error generate in data base");
    }
  });
};

module.exports.deleteBills = function (req, res) {
  Bill.findByIdAndRemove({ _id: req.params.id }).exec(function (err, doc) {
    if (err) {
      res.json({
        success: false,
        message: "something happened in the database",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Bill deleted successfully",
      });
    }
  });
};
