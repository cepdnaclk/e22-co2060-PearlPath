const mongoose = require('mongoose');
const Route = require('../models/Route');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

const sampleRoutes = [
    {
        name: "Colombo to Ella Scenic Journey",
        description: "Experience the world-famous scenic train and road journey winding through lush green tea estates, cascading waterfalls, and misty mountain ranges.",
        destination: "Ella",
        duration: "5 hours 30 mins",
        distance: "220 km",
        waypoints: [
            { lat: 6.9271, lng: 79.8612, name: "Colombo (Start)", description: "The bustling commercial capital of Sri Lanka." },
            { lat: 7.2906, lng: 80.6337, name: "Kandy (Cultural Capital)", description: "Home to the sacred Temple of the Tooth Relic." },
            { lat: 6.9497, lng: 80.7891, name: "Nuwara Eliya (Little England)", description: "A cool mountain getaway known for tea plantations." },
            { lat: 6.8724, lng: 81.0510, name: "Ella (Scenic Ending)", description: "A beautiful highland village famous for the Nine Arch Bridge." }
        ],
        pathCoordinates: [
            [6.9271, 79.8612],
            [7.1500, 80.1500],
            [7.2906, 80.6337],
            [7.1200, 80.7200],
            [6.9497, 80.7891],
            [6.8724, 81.0510]
        ]
    },
    {
        name: "Southern Coastal Escapade",
        description: "Travel along the golden sandy beaches of Sri Lanka, exploring historic colonial forts, vibrant surfing hotspots, and wild national parks.",
        destination: "Galle",
        duration: "4 hours 15 mins",
        distance: "260 km",
        waypoints: [
            { lat: 6.9271, lng: 79.8612, name: "Colombo (Start)", description: "Starting point from the capital." },
            { lat: 6.0535, lng: 80.2117, name: "Galle Fort", description: "A UNESCO World Heritage Site with historic Dutch architecture." },
            { lat: 5.9482, lng: 80.4578, name: "Mirissa Beach", description: "Famous for sandy bays, whale watching, and coconut tree hills." },
            { lat: 6.3712, lng: 81.5165, name: "Yala National Park", description: "Home to the highest density of leopards in the world." }
        ],
        pathCoordinates: [
            [6.9271, 79.8612],
            [6.5833, 79.9667],
            [6.2422, 80.0594],
            [6.0535, 80.2117],
            [5.9482, 80.4578],
            [6.1340, 81.1232],
            [6.3712, 81.5165]
        ]
    },
    {
        name: "Cultural Triangle Route",
        description: "Explore the ancient kingdoms of Sri Lanka, climbing sky-high rock fortresses and walking through centuries-old ruins and temples.",
        destination: "Sigiriya",
        duration: "6 hours 0 mins",
        distance: "230 km",
        waypoints: [
            { lat: 6.9271, lng: 79.8612, name: "Colombo (Start)", description: "Starting point from the capital." },
            { lat: 7.8592, lng: 80.6517, name: "Dambulla Cave Temple", description: "Largest and best-preserved cave temple complex in Sri Lanka." },
            { lat: 7.9570, lng: 80.7603, name: "Sigiriya Lion Rock", description: "A majestic 200m high ancient fortress ruin rising from the jungle." },
            { lat: 7.9403, lng: 81.0188, name: "Polonnaruwa", description: "The ancient medieval capital of Sri Lanka with well-preserved ruins." }
        ],
        pathCoordinates: [
            [6.9271, 79.8612],
            [7.2906, 80.6337],
            [7.8592, 80.6517],
            [7.9570, 80.7603],
            [7.9403, 81.0188]
        ]
    }
];

async function seed() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(uri);
        console.log("Connected to database successfully.");

        // Clear existing routes
        await Route.deleteMany({});
        console.log("Cleared old routes.");

        // Insert sample routes
        await Route.insertMany(sampleRoutes);
        console.log("Successfully seeded sample routes!");

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding routes:", error);
        mongoose.connection.close();
        process.exit(1);
    }
}

seed();
