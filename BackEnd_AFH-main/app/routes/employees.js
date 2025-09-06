const express = require('express');
const router = express.Router();
const EmployeeController = require("../controllers/employees");


router.get('/findAllEmployees',EmployeeController.getAllEmployees);

router.get("/findEmployee/:id", EmployeeController.getEmployee);

router.post("/createEmployee", EmployeeController.createEmployee);

router.put("/updateEmployee/:id", EmployeeController.updateEmployee);

router.get('/findByAutoComplete',EmployeeController.findByAutoComplete);

router.delete('/deleteEmployee/:id',EmployeeController.deleteEmployee);

router.get('/findByPageEmployees', EmployeeController.findByPage);

module.exports=router