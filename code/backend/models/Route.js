const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, required: true },
    distance: { type: String, required: true },
    waypoints: [
        {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            name: { type: String, required: true },
            description: { type: String }
        }
    ],
    pathCoordinates: [
        [{ type: Number, required: true }] // Array of [lat, lng]
    ]
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
