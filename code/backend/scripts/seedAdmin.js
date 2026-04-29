const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

const seedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@pearlpath.com' });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
      await mongoose.connection.close();
      return;
    }

    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@pearlpath.com',
      phone: '+94000000000',
      password: 'Admin@123!',
      role: 'admin',
      status: 'approved'
    });

    console.log('🎉 Admin created successfully');

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    await mongoose.connection.close();
  }
};

seedAdmin();