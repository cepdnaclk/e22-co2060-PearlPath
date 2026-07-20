const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    pricePerNight: { type: Number, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    images: [{ type: String, required: true }],
    rooms: { type: Number, default: 1 },
    starRating: { type: Number, default: 3 },
    amenities: [{ type: String }],
    contactNumber: { type: String },
    whatsappNumber: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

if (mongoose.models && mongoose.models.Hotel) {
    delete mongoose.models.Hotel;
}
if (mongoose.modelSchemas && mongoose.modelSchemas.Hotel) {
    delete mongoose.modelSchemas.Hotel;
}

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
