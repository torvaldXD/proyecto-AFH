const express = require('express');
const router = express.Router();

const billController = require('../controllers/bills');

router.post('/createBill',billController.createBill);

router.get('/findByAutoComplete', billController.findByAutoComplete);

router.get('/findByPageBills', billController.findByPage);

router.get('/findAllBills',billController.getAllBills);

// router.get('/findQuote/:id',billController.getQuote);

// router.put('/updateQuote/:id',billController.updateQuote);

router.delete('/deleteBills/:id',billController.deleteBills);

module.exports=router;