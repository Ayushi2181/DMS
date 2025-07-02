const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's flood history
router.get('/flood-history', auth, async (req, res) => {
    try {
        const floodHistory = await FloodRisk.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        
        res.json(floodHistory);
    } catch (error) {
        console.error('Error fetching flood history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ UserID: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
