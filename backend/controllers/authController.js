
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || email || password) {
            return res.status(400), json({ message: 'Please provide all required fields: name, email, and password' })
        }
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
        console.log('Signin error:', error);
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