const mongoose = require('mongoose')



const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(' ***** DB_Connect sucessfull: ***** ' );
    } catch (err) {
        console.log(' ***** DB_Connect error: ***** ',err.message );
    }}


module.exports={ dbConnect }