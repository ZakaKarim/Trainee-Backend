const express = require('express')
const app = express();

const db = require('./db');

 
const bodyParser = require('body-parser');
app.use(bodyParser.json());



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


app.listen(PORT, ()=>{
    console.log(`⚙️ Server is Started on Port : ${PORT}⚙️`)
})

