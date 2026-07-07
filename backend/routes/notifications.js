const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/auth');

router.use(protect);

// @desc    Get user's in-app notifications
// @route   GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get targeted announcements based on user role
// @route   GET /api/notifications/announcements
router.get('/announcements', async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'citizen') {
      filter = { target: { $in: ['all', 'citizens'] } };
    } else if (req.user.role === 'worker') {
      filter = { target: { $in: ['all', 'workers'] } };
    }
    // Admin sees all announcements by default

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
