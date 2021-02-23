const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoute = require('./routes/posts');

dotenv.config();

//import routers
const authRouter = require('./routes/auth.js');


mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connected to db");
    
   
}).catch((err)=>{
    console.log(err);
})

//Middleware
app.use(express.json());





//route midllewares

app.use('/api/user',authRouter);

app.use('/api/posts',postRoute);


app.listen(3000,()=>console.log('Server Up and running'));
