const Community = require('../../models/Community');
const User = require('../../models/User');

// Get all communities
const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find({});
        res.status(200).json({ communities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new community
const createCommunity = async (req, res) => {
    try {
        const { Name, Location, Type, Details } = req.body;
        const CreatedBy = req.user.UserID;

        // Generate a new community ID
        const count = await Community.countDocuments();
        const ComID = count + 1;

        // Create the community with the creator as the first user and leader
        const newCommunity = await Community.create({
            ComID,
            Name,
            LocationID: null, // You might want to create a location record and use its ID
            Leader: CreatedBy,
            CreatedBy,
            Users: [CreatedBy],
            JoinRequests: [],
            DateCreated: new Date(),
            Type,
            Details,
            Location
        });

        // Update the user's communities
        await User.findOneAndUpdate(
            { UserID: CreatedBy },
            { $push: { Community: ComID } }
        );

        res.status(201).json({ community: newCommunity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Join a community
const joinCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const UserID = req.user.UserID;

        // Check if community exists
        const community = await Community.findOne({ ComID: id });
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        // Check if user is already a member
        if (community.Users.includes(UserID)) {
            return res.status(400).json({ error: 'User is already a member of this community' });
        }

        // Add user to community
        await Community.findOneAndUpdate(
            { ComID: id },
            { $push: { Users: UserID } }
        );

        // Add community to user's communities
        await User.findOneAndUpdate(
            { UserID },
            { $push: { Community: parseInt(id) } }
        );

        res.status(200).json({ message: 'Successfully joined the community' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Leave a community
const leaveCommunity = async (req, res) => {
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
            return res.status(400).json({ error: 'User is not a member of this community' });
        }

        // Check if user is the leader
        if (community.Leader === UserID) {
            return res.status(400).json({ error: 'Community leader cannot leave. Transfer leadership first.' });
        }

        // Remove user from community
        await Community.findOneAndUpdate(
            { ComID: id },
            { $pull: { Users: UserID } }
        );

        // Remove community from user's communities
        await User.findOneAndUpdate(
            { UserID },
            { $pull: { Community: parseInt(id) } }
        );

        res.status(200).json({ message: 'Successfully left the community' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get community announcements
const getAnnouncements = async (req, res) => {
    try {
        const { id } = req.params;
        // Implement fetching announcements for a specific community
        res.json({ message: 'Community Announcements', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get community details
const getCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        const community = await Community.findOne({ ComID: id });
        
        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }
        
        res.json({ community });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getAnnouncements, 
    getCommunity, 
    getAllCommunities, 
    createCommunity, 
    joinCommunity, 
    leaveCommunity 
};