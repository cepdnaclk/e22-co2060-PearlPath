const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    bio: { type: String },
    location: { type: String, required: true },
    languages: [{ type: String }],
    pricePerDay: { type: Number },
    profilePictureUrl: { type: String },
    experienceYears: { type: Number, default: 0 },
    contactEmail: { type: String }
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;
