const express = require('express')
const router = express.Router();

const ProductController = require("./../Controller/product.controller.js")

//Register Route
router.route('/register').post(ProductController.registerProduct);
//Get Route
router.route('/').get(ProductController.getProduct);
//Put Route
router.route('/:id').put(ProductController.updateProduct)
//Delete Route
router.route('/:id').delete(ProductController.deleteProduct)

module.exports = router;