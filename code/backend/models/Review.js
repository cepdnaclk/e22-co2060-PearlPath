const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    targetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    targetModel: { 
        type: String, 
        required: true, 
        enum: ['Hotel', 'TourGuide', 'Vehicle'] 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
