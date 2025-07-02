const express = require('express');
const router = express.Router();
const {register , login} = require('../controllers/Authentication');
const authMiddleware = require('../middleware/auth');

router.post('/login', login) 

router.post('/register', register)

router.post('/validate-token', authMiddleware, (req, res) => {
    // If the request reaches here, the token is valid
    res.status(200).json({ message: 'Token is valid' });
})

module.exports = router;