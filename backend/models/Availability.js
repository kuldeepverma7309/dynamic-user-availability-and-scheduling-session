const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slots: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
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
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
