const express = require('express');
const router = express.Router();

const historyController = require('../controllers/historyinventory');

router.post('/createHistory',historyController.createHistory);

// router.get('/findByAutoComplete', historyController.findByAutoComplete);

router.get('/findAllHistories',historyController.getAllHistory);

// router.get('/findHistory/:id',historyController.getQuote);

// router.put('/updateHistory/:id',historyController.updateQuote);

router.delete('/deleteHistory/:id',historyController.deleteHistory);

router.get('/findByPageHistory', historyController.findByPage);

module.exports=router;