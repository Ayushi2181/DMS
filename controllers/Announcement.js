const Announcement = require('../models/Announcement');
const User = require('../models/User');

const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({})
            .populate('CreatedBy', 'Name')
            .sort({ CreationDate: -1 });
        
        res.status(200).json({ announcements });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createAnnouncement = async (req, res) => {
    try {
        const { Title, Content, CommunityID, Urgency } = req.body;
        const count = await Announcement.countDocuments();
        const AnnouncementID = count + 1;
        const CreatedBy = req.user.UserID;

        const newAnnouncement = await Announcement.create({
            AnnouncementID,
            Title,
            Content,
            CreatedBy,
            CommunityID,
            Urgency
        });

        res.status(201).json({ newAnnouncement });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        if (req.user.UserID !== announcement.CreatedBy && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await announcement.deleteOne();
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement
};
