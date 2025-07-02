const express = require('express');
const router = express.Router();
const { getAllAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/Announcement');
const authMiddleware = require('../middleware/auth');

// Get all announcements (public)
router.get('/', getAllAnnouncements);

// Create announcement (requires authentication)
router.post('/create', authMiddleware, createAnnouncement);

// Delete announcement (requires authentication and admin rights or ownership)
router.delete('/:id', authMiddleware, deleteAnnouncement);

module.exports = router;
