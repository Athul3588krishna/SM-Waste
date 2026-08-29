const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
  getAnnouncements,
} = require('../controllers/notificationController');

router.use(protect);

// @desc    Get user's in-app notifications
// @route   GET /api/notifications
router.get('/', getUserNotifications);

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', markNotificationRead);

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
router.put('/read-all', markAllNotificationsRead);

// @desc    Clear all user notifications
// @route   DELETE /api/notifications/clear-all
router.delete('/clear-all', clearAllNotifications);

// @desc    Get targeted announcements based on user role
// @route   GET /api/notifications/announcements
router.get('/announcements', getAnnouncements);

module.exports = router;
