const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { assessFloodRisk } = require('../services/floodVerificationService');
const FloodRisk = require('../models/FloodRisk');

router.post('/verify', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const assessment = await assessFloodRisk(latitude, longitude);

        if (!assessment) {
            return res.status(500).json({ error: 'Failed to assess flood risk' });
        }

        // Save assessment to database
        const floodRisk = new FloodRisk({
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            elevation: assessment.elevation,
            floodRisk: assessment.risk,
            riskScore: assessment.riskScore,
            details: assessment.details,
            soilMoisture: assessment.soilMoisture,
            riverLevel: assessment.riverLevel,
            userId: req.user._id
        });

        await floodRisk.save();

        // Return the assessment data
        res.json(assessment);
    } catch (error) {
        console.error('Error verifying flood risk:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.get('/history', auth, async (req, res) => {
    try {
        const floodRisks = await FloodRisk.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        
        res.json(floodRisks);
    } catch (error) {
        console.error('Error fetching flood risk history:', error);
        res.status(500).json({ 
            error: 'Error fetching flood risk history',
            details: error.message
        });
    }
});

module.exports = router;
