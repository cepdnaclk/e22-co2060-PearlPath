const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
    title: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Adventure', 'Wildlife', 'Culinary', 'Cultural', 'Wellness'], 
        required: true 
    },
    location: { type: String, required: true },
    description: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
    duration: { type: String, required: true },
    images: [{ type: String }],
    providedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerType: { 
        type: String, 
        enum: ['hotel', 'hotel_owner', 'vehicle_owner', 'tour_guide'], 
        required: true 
    }
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;
