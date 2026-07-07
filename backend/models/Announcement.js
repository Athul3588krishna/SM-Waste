const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an announcement title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add announcement content'],
    },
    target: {
      type: String,
      enum: ['all', 'citizens', 'workers'],
      default: 'all',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
