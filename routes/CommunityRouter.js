const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { getAnnouncements, getCommunity, getAllCommunities, createCommunity, joinCommunity, leaveCommunity } = require('../controllers/Community/Announcements');
const { getChats, sendMessage } = require('../controllers/Community/Chat');

// Get all communities (protected route - only for logged in users)
router.get('/', auth, getAllCommunities);

// Create a new community
router.post('/create', auth, createCommunity);

// Join a community
router.post('/:id/join', auth, joinCommunity);

// Leave a community
router.post('/:id/leave', auth, leaveCommunity);

// Get specific community details
router.get('/:id', auth, getCommunity);

// Chat endpoints
router.get('/:id/chat', auth, getChats);
router.post('/:id/chat', auth, sendMessage);

// Announcements endpoint
router.get('/:id/announcements', auth, getAnnouncements);

module.exports = router;