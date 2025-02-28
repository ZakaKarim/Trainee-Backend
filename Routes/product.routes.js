const express = require('express')
const router = express.Router();


const ProductController = require("../controller/product.controller.js");
const productValidation = require('../validators/productValidator.js');

//Register Route
router.route('/register').post(productValidation,ProductController.registerProduct);



//Get Route to fetch all the product
router.route('/').get(ProductController.getProduct);

//Get Route to Fetch A Single Product by findOne()
router.route('/:id').get(ProductController.singleProduct);

//Get Route to Fetch A Single Product by findById()
router.route('/get-by-id/:id').get(ProductController.singleProductById)

//Put Route to update the Product by findByIdAndUpdate()
router.route('/:id').put(ProductController.updateProduct)

//Put Route to update the Product by findOneAndUpdate()
router.route('/get-by-id-findOne/:id').put(ProductController.updateSingleProduct)



//Delete Route to delete the Product by findByIdAndDelete()
router.route('/:id').delete(ProductController.deleteProduct)

//Delete Route to delete the Product by findOneAndDelete()
router.route('/get-by-id/:id').delete(ProductController.deleteOneProduct)


module.exports = router;