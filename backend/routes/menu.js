const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add menu item (admin only)
router.post('/', async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const menuItem = new MenuItem({ name, price, description });
    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete menu item (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;