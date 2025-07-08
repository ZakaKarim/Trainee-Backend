//const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { sendEmail } = require("../utils/emailProductServer.js");
const fs = require('fs'); // Import the file system module

// const handleProductUpload = async (req, res) => {
//   try {
//     const { productName, productPrice, productDescription, clientEmail } =
//       req.body;
//     const productPicture = req.file;

//     console.log(productName, productPrice, productDescription, clientEmail);

//     // Check if all required fields are provided
//     if (
//       !productName ||
//       !productPrice ||
//       !productDescription ||
//       !clientEmail ||
//       !productPicture
//     ) {
//       return res
//         .status(404)
//         .json({ Message: "All feilds are required to order the product " });
//     }

//     // Get the file path
//     const filePath = productPicture.path;

//     // Upload product picture to Cloudinary
//     const imageUrl = await uploadOnCloudinary(filePath);

//     // Prepare email content
//     const emailSubject = `New Product: ${productName}`;
//     const emailText = `
//             Product Name: ${productName}
//             Price: ${productPrice}
//             Description: ${productDescription}
//             Image URL: ${imageUrl.secure_url}
//             `;
//     const emailHtml = `
//              <h1>New Product Details</h1>
//              <p><strong>Product Name:</strong> ${productName}</p>
//              <p><strong>Price:</strong> ${productPrice}</p>
//              <p><strong>Description:</strong> ${productDescription}</p>
//              <p><strong>Image:</strong> <img src="${imageUrl.secure_url}" alt="${productName}" /></p>
//             `;

//     // Prepare attachment
//     const attachments = [
//       {
//         filename: productPicture.originalname, // Name of the file
//         path: filePath, // Path to the file
//       },
//     ];

//     // Send email
//     await sendEmail(
//       clientEmail,
//       emailSubject,
//       emailText,
//       emailHtml,
//       attachments,
//     );

//     //response to the client
//     res
//       .status(200)
//       .json({ Message: "Product data received and email sent successfully!" });
//   } catch (error) {
//     console.log("Error:", error);
//     res
//       .status(500)
//       .json({ Message: "Internal Server Error", Error: error.message });
//   }
// };

const sendEmailWithAttachments = async (req, res) => {
  try {
    const { email, productName, price, description } = req.body; // Extract product data
    const attachments = req.files; // Extract uploaded files
    //console.log(req.file);
    // req.files.forEach(file => {
    //     console.log(file.path); // Path to each uploaded file
    //   });

    // Prepare email data
    const emailData = {
      to: email,
      subject: "Product Details",
      text: `Product Name: ${productName}\nPrice: ${price}\nDescription: ${description}`,
      html: `
        <h1>This is html content</h1>
        <h1>Product Details</h1>
        <p><strong>Product Name:</strong> ${productName}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Description:</strong> ${description}</p>
      `,
      attachments: attachments.map((file) => ({
        filename: file.originalname,
        path: file.path, // Path to the uploaded file
      })),
    };

    // Call the Nodemailer helper function
    await sendEmail(emailData);

    // Unlink (delete) files after sending the email
    attachments.forEach(file => {
         fs.unlink(file.path, (err)=>{
            if(err)
            {
                console.log(`Error deleting file ${file.path}:`, err)
            }
            else{
                console.log(`File ${file.path} deleted successfully`)
            }
         })
    })

    // Send success response
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

module.exports = { sendEmailWithAttachments };
