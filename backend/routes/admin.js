const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Apply protection and Admin role verification to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// @desc    Get all complaints in the system (filterable by status)
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
router.get('/complaints', async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  try {
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate('citizen', 'name email badge')
      .populate('worker', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update complaint verification status (Verify or Reject)
// @route   PUT /api/admin/complaints/:id/status
// @access  Private (Admin only)
router.put('/complaints/:id/status', async (req, res) => {
  const { status } = req.body; // should be 'verified' or 'rejected'

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update. Must be verified or rejected' });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Assign complaint to a sanitation worker
// @route   PUT /api/admin/complaints/:id/assign
// @access  Private (Admin only)
router.put('/complaints/:id/assign', async (req, res) => {
  const { workerId } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status === 'pending') {
      return res.status(400).json({ message: 'Please verify the complaint before assigning it to a worker' });
    }

    // Verify worker exists
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(400).json({ message: 'Invalid worker ID' });
    }

    complaint.worker = workerId;
    complaint.status = 'assigned';
    complaint.assignedAt = Date.now();
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all workers
// @route   GET /api/admin/workers
// @access  Private (Admin only)
router.get('/workers', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('name email points');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get dashboard statistics for charts and cards
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    // 1. Status count breakdown
    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format status stats into an object
    const statusCounts = {
      pending: 0,
      verified: 0,
      assigned: 0,
      completed: 0,
      rejected: 0,
    };
    statusStats.forEach((stat) => {
      statusCounts[stat._id] = stat.count;
    });

    // Total complaints count
    const totalComplaints = await Complaint.countDocuments();

    // 2. Waste category breakdown
    const typeStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Monthly complaints count (trends)
    const monthlyStats = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Map month number to text name
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const formattedMonthly = monthlyStats.map((stat) => ({
      name: `${monthNames[stat._id.month - 1]} ${stat._id.year}`,
      count: stat.count,
    }));

    // 4. Workers completion leaderboard count
    const workerStats = await Complaint.aggregate([
      { $match: { status: 'completed', worker: { $ne: null } } },
      {
        $group: {
          _id: '$worker',
          completedCount: { $sum: 1 },
        },
      },
    ]);

    // Populate worker names
    const populatedWorkerStats = await Promise.all(
      workerStats.map(async (stat) => {
        const worker = await User.findById(stat._id).select('name email');
        return {
          name: worker ? worker.name : 'Unknown Worker',
          completedCount: stat.completedCount,
        };
      })
    );

    res.json({
      statusCounts,
      totalComplaints,
      wasteTypeDistribution: typeStats.map((stat) => ({
        name: stat._id,
        value: stat.count,
      })),
      monthlyTrends: formattedMonthly,
      workerPerformance: populatedWorkerStats.sort((a, b) => b.completedCount - a.completedCount),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
