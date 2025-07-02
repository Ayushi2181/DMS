const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define a secret key (for development only)
const secretKey = 'sidhant123'; // Replace with a secure random string in production

// Register a new user
const register = async (req, res) => {
    try {
        const { Name, Email, Phone, Password, Address, UserType, Available } = req.body;

        if (!Email || Email.trim() === '') {
            return res.status(400).json({ error: 'Email is required and cannot be empty' });
        }

        // Check if user with this email already exists
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Generate a new user ID
        const count = await User.countDocuments();
        const UserID = count + 1;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Create the new user
        const newUser = await User.create({
            UserID,
            Name,
            Email,
            Phone,
            Password: hashedPassword,
            Address,
            UserType: UserType || ['affected'],
            Available: Available !== undefined ? Available : true,
            Community: [],
            CreationTime: new Date()
        });

        // Create JWT token using the hardcoded secret
        const token = jwt.sign(
            { UserID: newUser.UserID, Email: newUser.Email },
            secretKey,  // Use the hardcoded secret
            { expiresIn: '24h' }
        );

        // Return user info and token
        res.status(201).json({
            message: 'Registration successful',
            user: {
                UserID: newUser.UserID,
                Name: newUser.Name,
                Email: newUser.Email,
                UserType: newUser.UserType
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update the login function to use the same secret key
const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Find user by email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create JWT token using the hardcoded secret
        const token = jwt.sign(
            { UserID: user.UserID, Email: user.Email },
            secretKey,  // Use the hardcoded secret
            { expiresIn: '24h' }
        );

        // Return user info and token
        res.status(200).json({
            message: 'Login successful',
            user: {
                UserID: user.UserID,
                Name: user.Name,
                Email: user.Email,
                UserType: user.UserType
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login
};