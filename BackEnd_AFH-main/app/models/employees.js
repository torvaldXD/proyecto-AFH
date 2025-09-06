const mongoose = require("mongoose");

const EmployeesScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
    },

    lastName: {
      type: String,
      required: [true, "El Apellido es requerido"],
    },

    numberPhone: {
      type: String,
      required: false,
    },

    idNumber:{
        type:String,
        unique: true,
    },
    role: {
      type: String,
      
    },
    completeName:{
      type:String,
    }
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("employees", EmployeesScheme);
