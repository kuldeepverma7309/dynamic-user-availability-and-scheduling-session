const express = require('express');
const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get logged-in user info
router.get('/me', protect, getMe);

router.post('/logout', logoutUser)

module.exports = router;
