const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { upload, uploadImage } = require('../middleware/upload');

// Apply protection and Worker role verification to all routes in this file
router.use(protect);
router.use(authorize('worker'));

// Helper to determine badge level based on points
const getBadge = (points) => {
  if (points < 100) return 'Novice Reporter';
  if (points < 300) return 'Eco Cadet';
  if (points < 600) return 'Eco Sentinel';
  return 'Eco Warrior';
};

// @desc    Get all complaints assigned to the logged-in worker
// @route   GET /api/worker/complaints
// @access  Private (Worker only)
router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find({ worker: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('citizen', 'name email badge');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark complaint as completed (Cleaned)
// @route   PUT /api/worker/complaints/:id/complete
// @access  Private (Worker only)
router.put('/complaints/:id/complete', upload.single('photo'), uploadImage, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Verify it is assigned to this worker
    if (complaint.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to complete this task' });
    }

    if (complaint.status !== 'assigned') {
      return res.status(400).json({ message: 'Task is not in assigned state' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an after-cleaning photo' });
    }

    // Update Complaint status
    complaint.photoAfter = req.file.uploadedUrl;
    complaint.status = 'completed';
    complaint.completedAt = Date.now();
    await complaint.save();

    // Reward the reporting Citizen
    const citizen = await User.findById(complaint.citizen);
    if (citizen) {
      citizen.points += 50; // Earn 50 points per resolved complaint
      citizen.badge = getBadge(citizen.points);
      await citizen.save();
    }

    // Reward the Worker
    const worker = await User.findById(req.user._id);
    if (worker) {
      worker.points += 10; // Earn 10 points per completed cleaning task
      await worker.save();
    }

    res.json({
      message: 'Task completed successfully',
      complaint,
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
