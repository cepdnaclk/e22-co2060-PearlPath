const mongoose = require('mongoose');
const User = require('../models/User');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const existingUser = await User.findOne({ email: 'superadmin@pearlpath.com' });
        if (existingUser) {
            existingUser.role = 'super_admin';
            existingUser.status = 'approved';
            await existingUser.save();
            console.log("Existing user updated to Super Admin");
        } else {
            const newUser = new User({
                firstName: 'Super',
                lastName: 'Admin',
                email: 'superadmin@pearlpath.com',
                phone: '0000000000',
                password: 'superadmin123', // This will be hashed by the pre-save hook
                role: 'super_admin',
                status: 'approved'
            });
            await newUser.save();
            console.log("New Super Admin created: superadmin@pearlpath.com / superadmin123");
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

createSuperAdmin();
