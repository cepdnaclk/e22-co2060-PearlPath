const mongoose = require('mongoose');
const User = require('./models/User');
const Hotel = require('./models/Hotel');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully");

        const hotels = await Hotel.find().populate('ownerId', 'email firstName lastName role');
        console.log(`Total Hotels found in DB: ${hotels.length}`);
        
        hotels.forEach((h, idx) => {
            console.log(`\n${idx + 1}. Hotel Name: "${h.name}"`);
            console.log(`   Location: ${h.location}`);
            console.log(`   Status: ${h.status}`);
            console.log(`   Owner: ${h.ownerId ? `${h.ownerId.firstName} ${h.ownerId.lastName} (${h.ownerId.email}, role: ${h.ownerId.role})` : 'NULL'}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

run();
