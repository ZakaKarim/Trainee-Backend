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

//email to forget password generate OTP
async function forgetMail(email, username ,otp, expirationMinutes ) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'link2zakakarim@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Forget Password Generate OTP", // Subject line
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007bff;
          padding: 10px;
          color: #ffffff;
          text-align: center;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .content {
          padding: 20px;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          background-color: #f4f4f4;
          padding: 10px;
          margin: 20px 0;
          text-align: center;
          border-radius: 8px;
          color: #007bff;
        }
        .footer {
          text-align: center;
          color: #777777;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${username},</p>
          <p>You requested to reset your password. Use the OTP below to reset it:</p>
          <div class="otp">${otp}</div>
           <p>Valid for ${expirationMinutes} minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Thank you,<br>Your Company Name</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `, 
  });

  console.log("Message sent: %s", info.messageId);

}


module.exports = { 
  sendMain,
  forgetMail
 };