const nodemailer = require("nodemailer");

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", 
  secure: true,// Use Gmail as the email service
  auth: {
    user: process.env.EMAIL_USER, // Store in .env
    pass: process.env.EMAIL_PASSWORD, // App-specific password, // Your Gmail password or app-specific password
  },
});

// Function to send email
const sendEmail = async (emailData) => {
  try {
    const { to, subject, text, html, attachments } = emailData;

    // Prepare email options
    const mailOptions = {
      from: "link2zakakarim@gmail.com", // Sender email
      to, // Recipient email
      subject, // Email subject
      text, // Plain text body
      html, // HTML body
      attachments, // Attachments
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Throw error to be handled by the controller
  }
};

module.exports = { sendEmail };
// Create a transporter for sending emails
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Use your email service
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,// Store in .env
//     pass: process.env.EMAIL_PASSWORD,// App-specific password
//   },
// });

// // Function to send email
// const sendEmail = async (to, subject, text, html, attachments ) => {
//   const mailOptions = {
//     from: 'link2zakakarim@gmail.com',
//     to,
//     subject,
//     text,
//     html,
//     attachments,
//   };

//   return transporter.sendMail(mailOptions);
// };





//module.exports = { sendEmail };

