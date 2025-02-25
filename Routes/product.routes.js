const express = require('express')
const router = express.Router();


const ProductController = require("../controller/product.controller.js");
const productValidation = require('../validators/productValidator.js');

//Register Route
router.route('/register').post(productValidation,ProductController.registerProduct);

//Get Route
router.route('/').get(ProductController.getProduct);

//Put Route
router.route('/:id').put(ProductController.updateProduct)

//Delete Route
router.route('/:id').delete(ProductController.deleteProduct)

module.exports = router;