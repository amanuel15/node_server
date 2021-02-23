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

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Middleware
app.use(express.json());





//route midllewares

app.use('/api/user',authRouter);

app.use('/api/posts',postRoute);

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
