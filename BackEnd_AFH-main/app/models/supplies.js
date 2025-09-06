const mongoose = require('mongoose');




const SuppliesScheme= new mongoose.Schema({
    
    name: {
        type: String,
    },

    description:{
        type: String,
    },

    amount:{
        type: Number,
    },

    inventoryStatus: {
        type: String,
        default: "EN EXISTENCIA"
    },
    maxRange: {
        type: String,
    },
    minRange: {
        type: String,
    },
    unit: {
        type: String,
    },

},{
    versionKey:false
})



module.exports = mongoose.model('supplies',SuppliesScheme);