const mongoose = require("mongoose");

const QuotesScheme = new mongoose.Schema(
  {
    project: {
      type: String,
    },
    contractor: {
      type: String,
    },
    employer: {
      type: String,
    },

    addressedTo: {
      type: String,
    },

    deliveryTime: {
      type: String,
    },

    pay: {
      type: String,
    },

    area: {
      type: String,
    },
    scope: {
      type: String,
    },

    code: {
      type: String,
      unique: true,
    },

    items: [
      {
        number: { type: Number },
        description: { type: String },
        unit: { type: String },
        unitValue: { type: Number },
        fullValue: { type: Number },
        amount: { type: Number },
      },
    ],

    client: {
      name: {
        type: String,
      },

      address: {
        type: String,
      },

      department: {
        type: String,
      },

      city: {
        type: String,
      },

      nit: {
        type: String,
      },

      status: {
        type: String,
      },
    },

    creationDate: {
      type: String,
    },

    files: [
      { 
        rute: { type: String }, 
        creationDate: { type: String }, 
        name: { type: String }, 
        timeCreated: { type: String }, 
        clientName: { type: String }, 
      }
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("quotes", QuotesScheme);
