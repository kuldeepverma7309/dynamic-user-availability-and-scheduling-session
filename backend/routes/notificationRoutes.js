const express = require('express');
const { createNotification, getNotificationsForUser, markNotificationAsSent } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get notifications for logged-in user
router.get('/', protect, getNotificationsForUser);

// Create a new notification (typically handled internally)
router.post('/', protect, createNotification);

// Mark a notification as sent
router.put('/mark-sent', protect, markNotificationAsSent);

module.exports = router;
