const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    ComID: {
        type: Number,
        required: true
    },

    Users: {
        type: [Number],
        required: true
    },

    JoinRequests: {
        type: [Number],
    },

    Name: {
        type: String,
        required: true
    },
    LocationID: {
        type: Number,
        required: false
    },
    Location: {
        type: String,
        required: false
    },
    Type: {
        type: String,
        enum: ['Flood', 'Earthquake', 'Fire', 'Cyclone', 'Others'],
        default: 'Others',
        required: false
    },
    Details: {
        type: String,
        required: false
    },
    Leader: {
        type: Number,
        required: true
    },
    CreatedBy: {
        type: Number,
        required: true
    },
    DateCreated: {
        type: Date,
        required: true, 
        default: Date.now
    }
});

module.exports = mongoose.model('Community', communitySchema);