const express = require('express')
const app = express();

const db = require('./db');
require("dotenv").config();
 
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(express.json({limit: "30kb"}))
app.use(express.urlencoded({extended: true, limit: "30kb"}))
app.use(express.static("public"));


const PORT = 8000;



//Import the Router Files
const userRoute = require("./routes/user.routes.js");
const productRoute = require("./routes/product.routes.js");
const populateUser = require('./routes/populate.routes.js');
const productAggregationRoutes = require('./routes/productAggregationRoutes.js');
const userAggregationRoutes = require('./routes/userAggregationRoutes.js');

//Use the Router Files
app.use("/user",userRoute)
app.use("/product",productRoute)
app.use("/populate",populateUser)
app.use("/aggregate",productAggregationRoutes)
app.use("/aggregateuser",userAggregationRoutes)



//Calling the DataBase Name
db();

app.listen(PORT, ()=>{
    console.log(`⚙️ Server is Started on Port : ${PORT}⚙️`)
})

