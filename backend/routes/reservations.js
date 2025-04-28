const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();

// Create reservation
router.post('/', async (req, res) => {
  const { userId, date, time, seats, cart } = req.body;
  try {
    const reservation = new Reservation({ userId, date, time, seats, cart });
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user reservations
router.get('/user/:userId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.params.userId }).populate('cart.itemId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all reservations (admin only)
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('userId').populate('cart.itemId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update reservation status (admin only)
router.put('/:id', async (req, res) => {
  const { status, paymentStatus } = req.body;
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    );
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete reservation (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;