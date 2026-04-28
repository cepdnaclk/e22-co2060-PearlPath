const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    makeAndModel: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['Car', 'Van', 'TukTuk', 'Scooter'],
        required: true
    },
    seats: {
        type: Number,
        required: true,
        default: 4
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    transmission: {
        type: String,
        enum: ['Auto', 'Manual'],
        required: true
    },
    hasAC: {
        type: Boolean,
        default: true
    },
    images: {
        type: [String],
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
