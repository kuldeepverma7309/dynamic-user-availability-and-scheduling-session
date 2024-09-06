const nodemailer = require('nodemailer');
const Session = require('../models/Session');

// Create a transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Function to send notifications to all users in a session
const notifySessionUsers = async (sessionId, notificationType) => {
  try {
    // Fetch session and attendees
    const session = await Session.findById(sessionId).populate('attendees');
    if (!session) {
      throw new Error('Session not found');
    }

    const attendees = session.attendees;

    // Notification messages
    const messages = {
      'sessionCreated': 'A new session has been created.',
      'sessionUpdated': 'A session has been updated.',
      'sessionDeleted': 'A session has been deleted.',
    };

    const message = messages[notificationType] || 'Notification';

    // Send email to all attendees concurrently
    await Promise.all(attendees.map(async (attendee) => {
      await sendEmail(attendee.email, 'Session Notification', message);
    }));

  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

module.exports = {
  notifySessionUsers,
};
