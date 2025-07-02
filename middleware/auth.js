const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = 'sidhant123';

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, secretKey);
        
        // Fetch user by UserID from the token payload
        const user = await User.findOne({ UserID: decoded.UserID }); // Use correct field (UserID)
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user; // Attach user to req
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};