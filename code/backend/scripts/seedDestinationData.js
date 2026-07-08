const mongoose = require('mongoose');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const TourGuide = require('../models/TourGuide');
require('dotenv').config({ path: __dirname + '/../.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create a test user for ownership
        let testUser = await User.findOne({ email: 'demoprovider@pearlpath.com' });
        if (!testUser) {
            testUser = new User({
                email: 'demoprovider@pearlpath.com',
                password: 'password123',
                firstName: 'Demo',
                lastName: 'Provider',
                phone: '1234567890',
                roles: ['hotel_owner', 'tour_guide']
            });
            await testUser.save();
        }

        const locations = ['Central Province', 'Ella', 'Southern Province', 'Galle', 'Kandy'];

        const hotelsData = locations.map(loc => ({
            ownerId: testUser._id,
            name: `${loc} Grand Hotel`,
            description: `A luxurious stay in the heart of ${loc}. Enjoy premium amenities and breathtaking views.`,
            pricePerNight: Math.floor(Math.random() * 100) + 50,
            location: loc,
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            images: [],
            rooms: Math.floor(Math.random() * 10) + 1,
            starRating: 4 + Math.floor(Math.random() * 2), // 4 or 5
            amenities: ['Free WiFi', 'Pool', 'Breakfast Included'],
            status: 'approved'
        }));

        const guidesData = locations.map(loc => ({
            userId: testUser._id,
            name: `Guide in ${loc}`,
            bio: `Expert local guide with years of experience showing the best spots in ${loc}.`,
            location: loc,
            languages: ['English', 'Sinhala'],
            pricePerDay: Math.floor(Math.random() * 50) + 30,
            profilePictureUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            experienceYears: Math.floor(Math.random() * 10) + 1,
            contactEmail: 'guide@pearlpath.com'
        }));

        // Delete previous demo data
        await Hotel.deleteMany({ ownerId: testUser._id });
        await TourGuide.deleteMany({ userId: testUser._id });

        await Hotel.insertMany(hotelsData);
        await TourGuide.insertMany(guidesData);

        console.log('Successfully seeded database with hotels and tour guides.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
