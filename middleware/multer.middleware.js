const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
      console.log("File is :", file)
    }
  })
  
// Create the upload instance
const upload = multer({ storage: storage });
// Export the upload instance
module.exports = {upload};