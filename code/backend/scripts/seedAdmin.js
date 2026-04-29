const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  const mongoURI = 'mongodb+srv://tharakadenuwan5555:tharaka@ac-z2gc85q.mongodb.net/pearlpath?retryWrites=true&w=majority';

  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@pearlpath.com' });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123!', 10);

    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@pearlpath.com',
      phone: '+94000000000',
      password: hashedPassword,
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