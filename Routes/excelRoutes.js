const express = require('express')
const router = express.Router();

//Multer Middleware
const {upload} = require('../middleware/multer.middleware.js')

const {uploadExcel} = require ('../controller/excelController.js')

// Route to handle file upload
router.route("/upload").post(upload.single('excelFile'), uploadExcel)

module.exports = router;