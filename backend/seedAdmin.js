const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await connectDB();
    await User.deleteMany({ email: 'admin@example.com' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user seeded');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin:', error);
    mongoose.connection.close();
  }
};

seedAdmin();