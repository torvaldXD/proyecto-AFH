const Quote = require("../models/quotes");
const Codes = require("../models/codeQuote");

module.exports.getAllCodesQuotes = (req, res) => {
  try {
    Codes.find({})
      .sort({ $natural: -1 })
      .limit(1)
      .exec(function (error, result) {
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

module.exports.createQuote = (req, res) => {
  try {
    //search tool if exists
    Quote.find({ code: req.body.quotes.code }).exec(function (err, result) {
      if (result[0]) {
        res.status(200).json({
          success: true,
          message: "The Quote already exists in BD",
          price: result[0],
        });
      } else {
        //instantiation of a new user and encryptation password

        const quote = new Quote({
          code: req.body.quotes.code,
          project: req.body.quotes.project,
          client: req.body.quotes.client,
          items: req.body.quotes.items,
          pay: req.body.quotes.pay,
          scope: req.body.quotes.scope,
          area: req.body.quotes.area,
          deliveryTime: req.body.quotes.deliveryTime,
          addressedTo: req.body.quotes.addressedTo,
          employer: req.body.quotes.employer,
          contractor: req.body.quotes.contractor,
          creationDate: req.body.quotes.creationDate,
        });

        //save the user create into the DB
        quote.save(function (err, quoteDB) {
          if (err) {
            console.log("lanzo aqui", err);
          }
          const code = new Codes({ code: req.body.quotes.code });
          code.save(function (err, quoteCodeDB) {
            if (err) {
              console.log(err);
            }
            console.log("Guardo Code", quoteCodeDB.code);
          });
          res.status(201).json({
            success: true,
            message: "Quote create sucessfull",
            price: quoteDB,
          });
        });
      }
    });
  } catch (error) {
    //handle errors
    console.log("error generado", error);
  }
};

module.exports.getAllQuotes = (req, res) => {
  try {
    Quote.find({}).exec(function (error, result) {
      if (error) {
        res.send({
          success: false,
          message: "The quote not found",
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

module.exports.updateQuote = (req, res) => {
  Quote.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        code: req.body.quotes.code,
        project: req.body.quotes.project,
        client: req.body.quotes.client,
        items: req.body.quotes.items,
        pay: req.body.quotes.pay,
        deliveryTime: req.body.quotes.deliveryTime,
        addressedTo: req.body.quotes.addressedTo,
        employer: req.body.quotes.employer,
        contractor: req.body.quotes.contractor,
        scope: req.body.quotes.scope,
        area: req.body.quotes.area,
      },
    }
  ).exec(function (err, result) {
    try {
      if (err) {
        res.json({ success: false, message: "Quote not found" });
      } else {
        console.log("se actualizo la Cotizacón", result);
        res
          .status(200)
          .json({ success: true, message: "Quote updated successfully" });
      }
    } catch (error) {
      console.log("Error generate:", error);
    }
  });
};

module.exports.getQuote = (req, res) => {
  Quote.find({ _id: req.params.id }).exec(function (err, result) {
    try {
      if (result[0]) {
        res.send({ success: true, price: result[0] });
      }
    } catch (err) {
      res.send({ succes: false, message: "Quote not found" });
    }
  });
};

module.exports.deleteQuote = function (req, res) {
  Quote.findByIdAndRemove({ _id: req.params.id }).exec(function (err, doc) {
    if (err) {
      res.json({
        success: false,
        message: "something happened in the database",
      });
    } else {
      console.log("se elimino la cotizacion", doc);
      res.status(200).json({
        success: true,
        message: "Quote deleted successfully",
        price: doc,
      });
    }
  });
};

module.exports.findByPage = function(req, res) {
  const filters = JSON.parse(req.query.filters);
  // console.log("quotes",filters);
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

  Quote.find(query)
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
      Quote.countDocuments(query, function(err, count) {
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