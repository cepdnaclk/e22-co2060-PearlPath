const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    pricePerNight: { type: Number, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    images: [{ type: String }],
    rooms: { type: Number, default: 1 },
    starRating: { type: Number, default: 3 },
    amenities: [{ type: String }]
});

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
