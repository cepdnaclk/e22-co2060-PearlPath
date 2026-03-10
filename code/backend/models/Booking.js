const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    checkInDate: Date,
    checkOutDate: Date,
    guests: Number,
    totalPrice: Number
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
