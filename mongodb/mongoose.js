require('dotenv');
const mongoose  = require('mongoose');

module.exports={
  login()
    {
        mongoose.connect(process.env.mongodb,{
        useNewUrlParser:true,
        autoIndex:false,
        connectTimeoutMS: 10000,
        keepAlive:true,
        })

        mongoose.connection.on('connected', () => console.log("[DB] Database Connected"));
        mongoose.connection.on('err', () => console.log("[DB] Database Error"));
        mongoose.connection.on('disconnected', () => console.log("[DB] Database Disconnected"));

}
}

