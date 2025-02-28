const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,// Store in .env
        pass: process.env.EMAIL_PASSWORD,// App-specific password
    }
});


// async..await is not allowed in global scope, must use a wrapper
async function sendMain(email,username) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'link2zakakarim@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Welcome to Our App! i wish you learn something" , // Subject line
    //text , // plain text body
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Community!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header img {
          width: 100px;
        }
        h1 {
          color: #2d87f0;
          font-size: 24px;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          background-color: #2d87f0;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://example.com/logo.png" alt="Community Logo" />
        </div>
        <h1>Welcome to Our Community, ${username}!</h1>
        <p>We're thrilled to have you as part of our growing community. Thank you for joining! Here's a quick overview of what you can do:</p>
        <ul>
          <li>Connect with other members.</li>
          <li>Access exclusive content and resources.</li>
          <li>Participate in exciting events and discussions.</li>
        </ul>
        <p>We’re here to help if you have any questions or need assistance. Feel free to reach out at any time!</p>
        <p>To get started, please visit our community portal:</p>
        <a href="https://yourcommunityportal.com" class="button">Go to Community Portal</a>

        <div class="footer">
          <p>If you did not sign up for this community, please disregard this email.</p>
          <p>&copy; 2025 Our Community. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
    //html: `<h1>Hello ${username}!</h1><p>Your account was created successfully.</p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
// Function to send the welcome email
// Function to send the welcome email
// const sendWelcomeEmail = async (req,res) => {
//     const mailOptions = {
//       from: 'SiliconNexus@ethereal.email <SiliconNexus@ethereal.email>', // Sender address (usually an Ethereal email)
//       to: "ZAKA kARIM@gmail.com",                          // Receiver's email
//       subject: 'Welcome to Our App! ......',         // Subject line
//       text: "Hello world?     ", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     };
  
//     try {
//       const id = await transporter.sendMail(mailOptions); // Send the email
//       //console.log('Welcome email sent');
//      //console.log('Welcome email sent', mailOptions.message);
//       console.log("Message sent: %s" , id.messageId);
//       res.json(mailOptions);
//       console.log(mailOptions);

//     } catch (error) {
//       console.log('Error sending email:', error);
//     }
//   };


module.exports = { sendMain };