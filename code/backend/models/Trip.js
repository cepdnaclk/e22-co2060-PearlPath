const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  budget: {
    type: String,
    enum: ['budget', 'moderate', 'luxury'],
    required: true
  },
  interests: [{
    type: String
  }],
  itinerary: {
    type: Array,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', tripSchema);
