const mongoose = require('mongoose');


const CodeScheme= new mongoose.Schema({
    code:String,
},{versionKey:false});



module.exports = mongoose.model('codeQuote',CodeScheme);