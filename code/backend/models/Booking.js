const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    tourId: { type: Schema.Types.ObjectId, ref: 'TourGuide' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rooms: { type: Number, default: 1 },
    guests: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    bookingStatus: { type: String, default: 'pending', enum: ['pending', 'accepted', 'confirmed', 'rejected', 'cancelled'] },
    rejectionReason: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
