const Message = require('../../models/Message');
const Community = require('../../models/Community');
const User = require('../../models/User');
const socketIO = require('../../socket');

// Get community chat messages
const getChats = async (req, res) => {
    try {
        const { id } = req.params;
        const UserID = req.user.UserID;

        // Check if community exists
        const community = await Community.findOne({ ComID: id });
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        // Check if user is a member
        if (!community.Users.includes(UserID)) {
            return res.status(403).json({ error: 'You must be a member to view chat messages' });
        }

        // Get messages for this community
        const messages = await Message.find({ CommunityID: parseInt(id) })
            .sort({ DateSent: 1 });

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: error.message });
    }
};

// Send a message to the community chat
const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const UserID = req.user.UserID;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        // Check if community exists
        const community = await Community.findOne({ ComID: id });
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        // Check if user is a member
        if (!community.Users.includes(UserID)) {
            return res.status(403).json({ error: 'You must be a member to send messages' });
        }

        // Get user details for sender name
        const user = await User.findOne({ UserID });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a new message ID
        const count = await Message.countDocuments();
        const MessageID = count + 1;

        // Create the message
        const newMessage = await Message.create({
            MessageID,
            SenderID: UserID,
            SenderName: user.Name,
            CommunityID: parseInt(id),
            Message: message.trim(),
            DateSent: new Date()
        });

        // Emit the new message to all users in the community chat room
        const io = socketIO.getIO();
        io.to(`community_${id}`).emit('message_received', newMessage);

        res.status(201).json({ message: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getChats, sendMessage };