const mongoose = require('mongoose');

const floodRiskSchema = new mongoose.Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    elevation: {
        type: Number,
        required: true
    },
    floodRisk: {
        type: String,
        enum: ['LOW', 'MODERATE', 'HIGH'],
        required: true
    },
    riskScore: {
        type: Number,
        required: true
    },
    details: [{
        type: {
            type: String,
            enum: ['REGION', 'ELEVATION', 'RIVER', 'SOIL', 'SATELLITE', 'CROWDSOURCE', 'ERROR'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        riskLevel: {
            type: String,
            enum: ['LOW', 'MODERATE', 'HIGH']
        },
        value: Number,
        historicalData: [{
            year: Number,
            severity: String,
            affected: String,
            description: String
        }],
        riverInfo: {
            length: Number,
            basinArea: Number,
            states: [String]
        },
        additionalInfo: {
            floodProneAreas: [String],
            rivers: [String],
            elevation: String,
            floodCauses: [String]
        }
    }],
    regionInfo: {
        name: String,
        description: String,
        majorRivers: [String],
        historicalFloods: [{
            year: Number,
            severity: String,
            affected: String,
            description: String
        }]
    },
    nearestRiver: {
        name: String,
        distance: Number,
        length: Number,
        basinArea: Number,
        states: [String],
        floodRisk: String
    },
    soilMoisture: {
        type: Number
    },
    riverLevel: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

floodRiskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FloodRisk', floodRiskSchema);
