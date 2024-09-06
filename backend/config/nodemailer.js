const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password (use an app-specific password for Gmail)
  },
});

// Function to send an email (using async/await)
const sendSessionEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to, // Recipient's email
    subject, // Email subject
    text, // Email body
  };

  try {
    const info = await transporter.sendMail(mailOptions); // Use async/await for sending email
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error); // Handle errors properly
  }
};

module.exports = { sendSessionEmail };
