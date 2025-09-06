const mongoose = require("mongoose");

const InventoryScheme = new mongoose.Schema(
  {
    provider: {
      type: String,
    },
    typeItem: {
      type: String,
    },
    proyect: {
      type: String,
    },
    date: {
      type: String,
    },
    dateInside: {
      type: String,
    },
    dateOutside: {
      type: String,
    },
    type: {
      type: String,
    },
    dateShop: {
      type: String,
    },
    item: {
      type: String,
    },
    employee:{
      type:String
    },
    amount: {
      type: Number,
    },
    idBill:{
      type:String
    }
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("historyinventory", InventoryScheme);
