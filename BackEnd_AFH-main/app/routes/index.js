const express = require("express");

const router = express.Router();

const fs = require("fs");

const removeExtension = (fileName) => {
  return fileName.split(".").shift();
};

fs.readdirSync(__dirname).filter((file) => {
  const fileWithOutExt = removeExtension(file);
  const skip = ['index'].includes(fileWithOutExt);
  if (!skip) {
    router.use(`/${fileWithOutExt}`,require(`./${fileWithOutExt}`))
    console.log(" Cargar ------->", fileWithOutExt);
  }

});

router.get('*',(req,res)=>{
    res.status(404)
    res.send({error:'Not found'})
})

module.exports = router;
