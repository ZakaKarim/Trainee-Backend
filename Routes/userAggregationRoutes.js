const express = require('express')
const router = express.Router();

const getUser = require('../controller/userAggregationController.js')

// Route to get all products for a user
router.route("/:id").get(getUser.getUserProducts)


module.exports = router;