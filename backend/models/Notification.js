const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['sessionScheduled', 'sessionRescheduled', 'sessionCanceled'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sent: {
    type: Boolean,
    default: false,
  },
  preferences: {
    type: String,
    enum: ['email', 'sms'],
    default: 'email',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
