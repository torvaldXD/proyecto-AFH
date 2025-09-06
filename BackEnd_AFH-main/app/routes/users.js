const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

// router.get('/findAllUsers',userController.getAllUsers);

router.post("/findAllUsers", userController.getAllUsers);

router.get("/findUser/:id", userController.getUser);

router.put("/updateUser/:id", userController.updateUser);

router.post("/createUser", userController.createUser);

router.post("/login", userController.login);

router.get("/recoverPassword/:email", userController.forgotPassword);

router.delete("/deleteUser/:id", userController.deleteUser);

router.put('/updatePassword/:id', userController.updatePassword);

router.get('/findByPageUsers', userController.findByPage);

module.exports = router;
