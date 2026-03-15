const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rooms: { type: Number, required: true, min: 1 },
    guests: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    bookingStatus: { type: String, default: 'confirmed', enum: ['pending', 'confirmed', 'cancelled'] },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
