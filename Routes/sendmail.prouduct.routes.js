const express = require('express')
const router = express.Router();

const {handleProductUpload,sendEmailWithAttachments} = require('../controller/sendmail.product.controller.js')
//Multer Middleware
const {upload} = require('../middleware/multer.middleware.js')



// Define the API endpoint
// router.route('/upload-product').post(upload.single('productPicture'), handleProductUpload)


// Route to handle file uploads and send email
router.post('/send-email', upload.array('attachments', 5), sendEmailWithAttachments);


module.exports = router;