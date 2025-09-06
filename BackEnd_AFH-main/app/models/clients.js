const mongoose = require("mongoose");

const ClientsScheme = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    address: {
      type: String,
    },

    department:{type: String},

    city: {
      type: String,
    },

    nit:{
        type:String,
        unique: true,
    },

    status:{
      type:String,
      default:"ACTIVO"
    }
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("clients", ClientsScheme);