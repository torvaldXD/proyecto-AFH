const multer = require('multer');
const moment  = require('moment');

// let name = `${moment().year()}${moment().hour()}${moment().minute()}${moment().second()}`;

const multerConfig = {
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname +'../../../uploads'); // los uploads se subirán en esta carpeta
    },
    filename: (req, file, cb) => {
      // obtener la extensión del archivo
      const extension = file.mimetype.split('/')[1];
    //   const myDate = new Date().toJSON().replace(new RegExp(':', 'g'),'.');
      
      console.log("miruta",__dirname)
      // generar ID para ponerlo como nombre de imagen
      cb(null,   file.fieldname + Date.now() + file.originalname);
    }
  }),
  fileFilter(req, file, cb) {
    if ( file.mimetype === 'image/jpeg' ||  file.mimetype ==='image/png' ) { // solo aceptar imágenes
      cb(null, true);
    } else {
      cb(new Error('Formato de imagen no válido'))
    }
  },
}

module.exports = multerConfig;