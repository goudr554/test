const mongoose = require('mongoose');
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const seedMenu = async () => {
  try {
    await connectDB();
    await MenuItem.deleteMany();
    const items = [
      { name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato and mozzarella' },
      { name: 'Caesar Salad', price: 8.99, description: 'Fresh romaine with Caesar dressing' },
      { name: 'Spaghetti Carbonara', price: 14.99, description: 'Pasta with creamy egg sauce and bacon' },
    ];
    await MenuItem.insertMany(items);
    console.log('Menu items seeded');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding menu:', error);
    mongoose.connection.close();
  }
};

seedMenu();