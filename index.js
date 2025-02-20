const express = require('express')
const app = express();

const db = require('./db');

 
const bodyParser = require('body-parser');
app.use(bodyParser.json());



const PORT = 8000;


//Import the Router Files
const userRoute = require("./Routes/user.routes.js");
const productRoute = require("./Routes/product.routes.js");

//Use the Router Files
app.use("/user",userRoute)
app.use("/product",productRoute)


app.listen(PORT, ()=>{
    console.log(`⚙️ Server is Started on Port : ${PORT}⚙️`)
})

