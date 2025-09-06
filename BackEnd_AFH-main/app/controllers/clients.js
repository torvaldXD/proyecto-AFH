const Client = require("../models/clients");

module.exports.getAllClients = (req, res) => {
  Client.find({}).exec(function (err, result) {
    try {
      if (err) {
        res.send({ message: "Error generate in DB" });
      }
      res.json({ docs: result });
      return;
    } catch (error) {
      console.log("Error generate in data base");
    }
  });
};

module.exports.getClient = (req, res) => {
  Client.find({ _id: req.params.id }).exec(function (err, result) {
    try {
      if (result[0]) {
        res.send({ success: true, client: result[0] });
      }
    } catch (err) {
      res.send({ message: "Employee not found" });
    }
  });
};

module.exports.createClient = (req, res) => {
  try {
    //search user if exists
    Client.find({ nit: req.body.client.nit }).exec(function (
      err,
      result
    ) {
      if (result[0]) {
        res.status(200).json({
          success: true,
          message: "The client already exists in BD",
        });
      } else {
        //new client
        const client = new Client({
          name: req.body.client.name,
          nit: req.body.client.nit,
          city: req.body.client.city,
          address: req.body.client.address, 
          department:req.body.client.department
        });
        //save the client create into the DB
        client.save(function (err, usuarioDB) {
          if (err) {
            console.log(err);
          }
          res.status(201).json({
            success: true,
            message: "Client create sucessfull",
          });
        });
      }
    });
  } catch (error) {
    //handle errors
    console.log(error);
  }
};

module.exports.updateClient= (req, res) => {
    Client.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
            name: req.body.client.name,
            nit: req.body.client.nit,
            city: req.body.client.city,
            address: req.body.client.address, 
            status: req.body.client.status,  
            department:req.body.client.department
        },
      }
    ).exec(function (err, result) {
      try {
        if (err) {
          res.json({ success: false, message: "Client not found" });
        } else {
          res
            .status(200)
            .json({ success: true, message: "Client updated successfully" });
        }
      } catch (error) {
        console.log("Error generate:", error);
      }
    });
  };


  module.exports.findByAutoComplete = function(req, res) {
    Client.find({
      status: "ACTIVO" ,
        $or: [
            { name: { $regex: req.query.filters, $options: "i" } },
            { city: { $regex: req.query.filters, $options: "i" } },
            
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


  module.exports.deleteClient = function (req, res) {
    Client.findByIdAndRemove({ _id: req.params.id }).exec(function (err, doc) {
      if (err) {
        res.json({
          success: false,
          message: "something happened in the database",
        });
      } else {
        // console.log(doc);
        // Codes.findOneAndRemove({code:doc.codeTool}).exec()
        console.log("se elimino la herramienta",doc);
        res.status(200).json({
          success: true,
          message: "Client deleted successfully",
          client:doc
        });
      }
    });
  };

  module.exports.findByPage = function(req, res) {
    const filters = JSON.parse(req.query.filters);
    // console.log("clients",filters);
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 100;
    limite = Number(limite);
  
    const query = {};
  
    if (filters.global && filters.global.value) {
      const regex = new RegExp(filters.global.value, "i");
      query["$or"] = [
        { name: regex },
        { city: regex },
        { nit: regex },
        { status: regex }
      ];
    }
  
    Client.find(query)
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
        Client.countDocuments(query, function(err, count) {
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