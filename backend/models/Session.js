const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email.']
      }
    }
  ],
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 30 
  },
  type: {
    type: String,
    enum: ['one-on-one', 'group'],
    default: 'one-on-one'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled'
  },
  title: {
    type: String,
    required: true, 
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
