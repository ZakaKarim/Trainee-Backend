const express = require('express')
const router = express.Router();
const getProducts = require('../controller/productAggregationController.js');


// Define the route to get products by a specific user
// :userId is a parameter in the URL (e.g., /products/12345)
router.route("/:id").get(getProducts.getProductsByUser);

module.exports = router;