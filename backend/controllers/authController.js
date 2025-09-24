
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields: name, email and password' });
        }

        if (!password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User with this email already exits' })

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error('Signup error: ', error)
        res.status(500).json({ message: 'Internal server error' });
    }
}


const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please provide both email and password' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user, password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

        res.json({
            message: 'Signed in sucessfully',
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
};

// Get User Profile

const getProfile = async (req, res) => {
    try {
        res.json({
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
        });
    } catch (error) {
        console.log('Get profile error:', error);
        res.status(500).json({ message: 'Interval server error' });
    }
}

const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
}

module.exports = { signup, signin, getProfile, logout }