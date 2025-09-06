const express = require('express');
const router = express.Router();
const FilesController = require('../controllers/files');
const multipart = require('connect-multiparty');
const multipartMidleware = multipart();

//Definition rutes

// router.get('/findByIdobjeto/', [verificaToken], controller.findByIdObject);
// router.get('/findByDocumentId/:id', [verificaToken], controller.findByDocumentId);
router.post('/uploads/', [multipartMidleware], FilesController.uploadsImageTools);
router.post('/createPdfQuotes/', [multipartMidleware], FilesController.createPDFQuotes);
router.post('/updatePdfQuotes/', [multipartMidleware], FilesController.updatePDFQuotes);
router.post('/update/',[multipartMidleware], FilesController.updateImageTools);
router.delete('/delete/:id',FilesController.deleteFileTools);
router.delete('/deleteOneFile/:id',FilesController.deleteOneFilePDF);
router.post('/download/',FilesController.getPdfQuotes);


router.post('/deleteQuote/',FilesController.deleteFileQuotes);

module.exports=router;