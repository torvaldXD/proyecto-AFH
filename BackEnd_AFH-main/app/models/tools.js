const mongoose = require('mongoose');
const moment = require('moment');



const ToolsScheme= new mongoose.Schema({

    brand: {
        type: String,
        required: [true, "la marca es obligatoria"],
    },
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    codeTool: {
        type: String,
        unique: true,
        required: [true, "El codigo es obligatorio"]
    },
    registrationDate:{
        type:String,
        default: moment().format('DD-MM-YYYY')
    },
    
    state:{
        type:String,
    },
    entryDate:{
        type:String,
    },
    departureDate:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
    },
    status:{
        type: String,
        default:"ACTIVA"
    },

    inCharge:{
        name: {
          type: String,
        },
    
        lastName: {
          type: String
        },
    
        numberPhone: {
          type: String
        },
    
        idNumber:{
          type:String,
        },
        role: {
          type: String,
        },
        completeName:{
          type:String,
        }
      },
    admissionDate:{type:String},
    departureDate:{type:String}

},{
    versionKey:false
})

module.exports = mongoose.model('tools',ToolsScheme);