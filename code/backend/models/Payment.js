const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['hotel', 'vehicle', 'tour_guide', 'tour', 'experience', 'route'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected', 'refunded'],
    default: 'pending'
  },
  bankSlipUrl: {
    type: String
  },
  bankSlipFileName: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  transactionReference: {
    type: String
  },
  uploadedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
