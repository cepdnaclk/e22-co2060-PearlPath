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
    images: [{ type: String, required: true }],
    providedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    providerType: { 
        type: String, 
        enum: ['hotel', 'hotel_owner', 'vehicle_owner', 'tour_guide'], 
        required: true 
    },
    // Real Activity Owner / Operator Contact Details
    realOwnerName: { type: String, required: true },
    realOwnerPhone: { type: String, required: true },
    realOwnerEmail: { type: String, default: '' },
    realOwnerAddress: { type: String, default: '' },
    // Backward compatibility aliases
    organizerName: { type: String },
    organizerPhone: { type: String },
    organizerEmail: { type: String }
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;
