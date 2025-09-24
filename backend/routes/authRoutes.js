
const express = require('express');
const { signup, signin, getProfile, logout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', authenticateToken, getProfile);
router.post('/logout', logout);

module.exports = router;
