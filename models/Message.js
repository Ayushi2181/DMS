const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    MessageID: {
        type: Number,
        required: true
    },
    SenderID: {
        type: Number,
        required: true
    },
    SenderName: {
        type: String,
        required: true
    },
    CommunityID: {
        type: Number,
        required: true
    },
    Message: {
        type: String,
        required: true,
    },
    DateSent: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);