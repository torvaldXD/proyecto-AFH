const express = require('express');
const router = express.Router();

const quotesController = require('../controllers/quotes');

router.post('/createQuote',quotesController.createQuote);

router.get('/findAllQuotes',quotesController.getAllQuotes);

router.get('/findAllCodes',quotesController.getAllCodesQuotes);

router.get('/findQuote/:id',quotesController.getQuote);

router.put('/updateQuote/:id',quotesController.updateQuote);

router.delete('/deleteQuote/:id',quotesController.deleteQuote);

router.get('/findByPageQuotes', quotesController.findByPage);

module.exports=router;