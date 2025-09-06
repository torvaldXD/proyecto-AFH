require('dotenv').config();
const bodyParser = require("body-parser")
const express= require('express');
const cors= require('cors');
const app = express();

const {dbConnect}= require('./config/mongo')



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}))

app.use(cors());



app.use( '/api/', require('./app/routes') );
app.use(express.static('uploads'));
app.use('/public', express.static(__dirname + '/public'));

dbConnect();

app.listen(process.env.PORT,()=>{
    console.log("Escuchando por ------>",process.env.PORT);
})
