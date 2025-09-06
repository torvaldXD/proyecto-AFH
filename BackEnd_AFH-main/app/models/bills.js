const mongoose = require("mongoose");

const BillsScheme = new mongoose.Schema(
  {
    provider: {
        type: String,
    },
    idBill: {
        type: String,
    },
    price:{
        type: Number,
    },
    vat:{
        type: Number,
    },
    retention:{
        type: Number,
        default:0,
    },
    dateShop:{
        type: String,
    },
    total:{
        type: Number,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("bills", BillsScheme);