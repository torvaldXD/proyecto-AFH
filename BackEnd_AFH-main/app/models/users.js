const mongoose = require('mongoose');

const UserScheme= new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"],
    },
    lastName: {
        type: String,
        required: [true, "El Apellido es requerido"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El email es requerido"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerido"]
    },
    
    numberPhone: {
        type: String,
        required: false
    },
    
    verifyCode: {
        type: String,
        require: false,
    },
    
    role: {
        type: String,
    },
    image:{
        type:String,
        require:false
    },
    area:{
        type:String,
        require:false
    }
},{
    versionKey:false
})



module.exports = mongoose.model('users',UserScheme)