const express = require('express');
const router = express.Router();
const ClientsController = require("../controllers/clients");

router.get('/findAllClients',ClientsController.getAllClients);

router.get("/findClient/:id", ClientsController.getClient);

router.post("/createClient", ClientsController.createClient);

router.put("/updateClient/:id", ClientsController.updateClient);

router.get('/findByAutoComplete', ClientsController.findByAutoComplete);

router.delete('/deleteClient/:id',ClientsController.deleteClient);

router.get('/findByPageClients', ClientsController.findByPage);

module.exports=router