const express = require('express');
const router = express.Router();
const SuppliesController = require('../controllers/supplies');


//Definition rutes

router.get('/getSupplies',SuppliesController.getSupplies);

router.delete('/deleteSupply/:id',SuppliesController.deleteSupply);

router.get('/findSupply/:id',SuppliesController.getSupply);

router.post('/createSupply',SuppliesController.createSupply);

router.put('/updateSupply/:id',SuppliesController.updateSupply);

router.get('/findByAutoComplete', SuppliesController.findByAutoComplete);

router.get('/findByPageSupplies', SuppliesController.findByPage);

module.exports=router;