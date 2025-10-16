const express = require('express');
const { signup, signin, getProfile, logout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, getProfile);

module.exports = router;