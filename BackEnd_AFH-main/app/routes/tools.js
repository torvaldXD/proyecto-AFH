const express = require('express');
const router = express.Router();

const toolsController = require('../controllers/tools');

router.post('/createTool',toolsController.createTool);

router.get('/findAllTools',toolsController.getAllTools);

router.get('/findAllCodes',toolsController.getAllCodes);

router.get('/findTool/:id',toolsController.getTool);

router.put('/updateTool/:id',toolsController.updateTool);

router.delete('/deleteTool/:id',toolsController.deleteTool);

router.get('/findByAutoComplete', toolsController.findByAutoComplete);

router.put('/updateToolByHistory/:id',toolsController.updateToolByHistory);

router.get('/findByPageTools', toolsController.findByPage);

module.exports=router