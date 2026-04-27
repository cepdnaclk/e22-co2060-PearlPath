const mongoose = require('mongoose');
const User = require('./models/User');
const TourGuide = require('./models/TourGuide');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri).then(async () => {
    const user = await User.findOne({email: 'chamudikayagabamunu@gmail.com'});
    
    if (user) {
        user.role = 'tour_guide';
        await user.save();
        console.log("User role updated to tour_guide.");

        const guide = await TourGuide.findOne({userId: user._id});
        if (!guide) {
            const newGuide = new TourGuide({
                userId: user._id,
                name: `${user.firstName} ${user.lastName}`,
                location: 'City, Country',
                languages: ['English'],
                contactEmail: user.email,
                pricePerDay: 0,
                experienceYears: 0
            });
            await newGuide.save();
            console.log("Tour Guide profile created for this user.");
        } else {
            console.log("Tour Guide profile already existed for this user.");
        }
    } else {
        console.log("User not found.");
    }
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
