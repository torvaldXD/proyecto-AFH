const mongoose = require('mongoose');


const FilesScheme= new mongoose.Schema({

    originalFilename: String,
    name: String,
    dir: String,
    filename: String,
    title: String,
    type: String,
    size: String,
    path: String,
    url: String,
    ext: String,
    idObjeto: String,

},{
    versionKey:false
});

module.exports = mongoose.model('files',FilesScheme);