const express = require('express')
const router = express.Router();

const ProductWithUserPopulate = require("../controller/populate.users.controller.js");

// Existing route to get all products with populated user data
router.route("/").get(ProductWithUserPopulate.getProductWithUser);

// New route to get products by userId
router.route("/:id").put(ProductWithUserPopulate.getProudctWithUserId);

module.exports = router; 