const mongoose = require('mongoose');
const User = require('../models/User');
const Hotel = require('../models/Hotel');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

const test = async () => {
    try {
        await mongoose.connect(uri);
        const role = 'hotel_owner';
        const users = await User.find({ role }, '-password').lean();
        
        for (let user of users) {
            const hotels = await Hotel.find({ ownerId: user._id });
            user.listings = hotels;
        }
        
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

test();
