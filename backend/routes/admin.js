const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Team = require('../models/Team');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');
const sendEmail = require('../utils/emailService');

// Apply protection and Admin role verification to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// Helper to determine citizen badge level based on points
const getBadge = (points) => {
  if (points < 100) return 'Novice Reporter';
  if (points < 300) return 'Eco Cadet';
  if (points < 600) return 'Eco Sentinel';
  return 'Eco Warrior';
};

// ==========================================
// WORKER CRUD ENDPOINTS
// ==========================================

// @desc    Create a new worker account
// @route   POST /api/admin/workers
router.post('/workers', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const worker = await User.create({
      name,
      email,
      password,
      role: 'worker',
      isOnline: false,
    });

    res.status(201).json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      role: worker.role,
      isOnline: worker.isOnline,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all workers
// @route   GET /api/admin/workers
router.get('/workers', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' })
      .populate('team', 'name')
      .select('-password');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Edit a worker account
// @route   PUT /api/admin/workers/:id
router.put('/workers/:id', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ message: 'Worker not found' });
    }

    worker.name = req.body.name || worker.name;
    worker.email = req.body.email || worker.email;

    if (req.body.password) {
      worker.password = req.body.password;
    }

    const updatedWorker = await worker.save();
    res.json({
      _id: updatedWorker._id,
      name: updatedWorker.name,
      email: updatedWorker.email,
      role: updatedWorker.role,
      isOnline: updatedWorker.isOnline,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a worker account
// @route   DELETE /api/admin/workers/:id
router.delete('/workers/:id', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Remove worker from any team they are in
    if (worker.team) {
      await Team.findByIdAndUpdate(worker.team, {
        $pull: { members: worker._id },
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Worker account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// CLEANING TEAMS CRUD ENDPOINTS
// ==========================================

// @desc    Create a new cleaning team
// @route   POST /api/admin/teams
router.post('/teams', async (req, res) => {
  const { name, members } = req.body; // members is array of worker IDs

  try {
    const teamExists = await Team.findOne({ name });
    if (teamExists) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    const team = await Team.create({
      name,
      members,
    });

    // Update members' user documents with team reference
    await User.updateMany(
      { _id: { $in: members } },
      { $set: { team: team._id } }
    );

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all teams
// @route   GET /api/admin/teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await Team.find({}).populate('members', 'name email isOnline points');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a cleaning team
// @route   PUT /api/admin/teams/:id
router.put('/teams/:id', async (req, res) => {
  const { name, members } = req.body;

  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Identify removed members
    const oldMembers = team.members.map((id) => id.toString());
    const newMembers = members.map((id) => id.toString());
    const removedMembers = oldMembers.filter((id) => !newMembers.includes(id));

    // Update team document
    team.name = name || team.name;
    team.members = members;
    await team.save();

    // Reset team reference for removed members
    if (removedMembers.length > 0) {
      await User.updateMany(
        { _id: { $in: removedMembers } },
        { $set: { team: null } }
      );
    }

    // Set team reference for current members
    if (members.length > 0) {
      await User.updateMany(
        { _id: { $in: members } },
        { $set: { team: team._id } }
      );
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a cleaning team
// @route   DELETE /api/admin/teams/:id
router.delete('/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Clear team references for all members
    await User.updateMany(
      { _id: { $in: team.members } },
      { $set: { team: null } }
    );

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ANNOUNCEMENTS ENDPOINTS
// ==========================================

// @desc    Post a new municipal announcement
// @route   POST /api/admin/announcements
router.post('/announcements', async (req, res) => {
  const { title, content, target } = req.body;

  try {
    const announcement = await Announcement.create({
      title,
      content,
      target: target || 'all',
    });

    // Socket emission for announcement
    const io = req.app.get('io');
    if (io) {
      const room = target || 'all';
      if (room === 'all') {
        io.emit('new_announcement', { title, content, target: room });
      } else {
        io.to(room).emit('new_announcement', { title, content, target: room });
      }
    }

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// COMPLAINT WORKFLOW MANAGEMENT
// ==========================================

// @desc    Get all complaints (filterable by status)
// @route   GET /api/admin/complaints
router.get('/complaints', async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  try {
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate('citizen', 'name email badge')
      .populate('worker', 'name email points')
      .populate({
        path: 'team',
        populate: {
          path: 'members',
          select: 'name email'
        }
      });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify or Reject reported complaint
// @route   PUT /api/admin/complaints/:id/status
router.put('/complaints/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid verification status' });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    const title = `Waste Report ${status === 'verified' ? 'Approved' : 'Rejected'}`;
    const message = `Your report titled "${complaint.title}" has been ${status === 'verified' ? 'verified by the municipality. It is now awaiting assignment.' : 'rejected by municipal reviews.'}`;

    // Trigger Notification
    await Notification.create({
      user: complaint.citizen,
      title,
      message,
    });

    // Socket emission to citizen
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${complaint.citizen.toString()}`).emit('complaint_status_updated', {
        title,
        message,
        complaintId: complaint._id,
        status,
      });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Assign complaint to worker or team with a 1-2 day deadline
// @route   PUT /api/admin/complaints/:id/assign
router.put('/complaints/:id/assign', async (req, res) => {
  const { assignedToType, workerId, teamId, deadlineDays } = req.body;

  if (!['individual', 'team'].includes(assignedToType)) {
    return res.status(400).json({ message: 'Assignment type must be individual or team' });
  }

  const days = parseInt(deadlineDays) || 1;
  if (![1, 2].includes(days)) {
    return res.status(400).json({ message: 'Deadline must be 1 or 2 days' });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedToType = assignedToType;
    complaint.status = 'assigned';
    complaint.assignedAt = Date.now();
    complaint.deadlineAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    if (assignedToType === 'individual') {
      const worker = await User.findById(workerId);
      if (!worker || worker.role !== 'worker') {
        return res.status(400).json({ message: 'Invalid worker ID' });
      }
      complaint.worker = workerId;
      complaint.team = null;

      // In-app notification to worker
      await Notification.create({
        user: workerId,
        title: 'New Assignment',
        message: `You have been assigned a new cleanup: "${complaint.title}". Deadline: ${days} day(s).`,
      });
    } else {
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(400).json({ message: 'Invalid Team ID' });
      }
      complaint.team = teamId;
      complaint.worker = null;

      // In-app notification to all team members
      const notifications = team.members.map((memberId) => ({
        user: memberId,
        title: 'New Team Assignment',
        message: `Your team "${team.name}" has been assigned a cleanup: "${complaint.title}". Deadline: ${days} day(s).`,
      }));
      await Notification.insertMany(notifications);
    }

    await complaint.save();

    // Socket emission to worker or team members
    const io = req.app.get('io');
    if (io) {
      const title = assignedToType === 'individual' ? 'New Assignment' : 'New Team Assignment';
      const message = `You have been assigned a new cleanup: "${complaint.title}". Deadline: ${days} day(s).`;
      
      if (assignedToType === 'individual') {
        io.to(`user_${workerId}`).emit('new_task_assigned', { title, message, complaintId: complaint._id });
      } else {
        const team = await Team.findById(teamId);
        if (team && team.members) {
          team.members.forEach((memberId) => {
            io.to(`user_${memberId.toString()}`).emit('new_task_assigned', { 
              title, 
              message: `Your team "${team.name}" has been assigned a cleanup: "${complaint.title}". Deadline: ${days} day(s).`,
              complaintId: complaint._id 
            });
          });
        }
      }
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reassign overdue complaint
// @route   PUT /api/admin/complaints/:id/reassign
router.put('/complaints/:id/reassign', async (req, res) => {
  const { assignedToType, workerId, teamId, deadlineDays } = req.body;
  const days = parseInt(deadlineDays) || 1;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Reset after photo and cleanup records in case worker already uploaded something
    complaint.photoAfter = null;
    complaint.cleanedAt = null;

    // Dispatch a warning notification if the task was already overdue
    if (complaint.status === 'assigned' && complaint.deadlineAt < Date.now()) {
      if (complaint.assignedToType === 'individual' && complaint.worker) {
        await Notification.create({
          user: complaint.worker,
          title: '⚠️ Overdue Warning',
          message: `You had an overdue task: "${complaint.title}" which has been reassigned. Please ensure tasks are completed within the deadline in the future.`,
        });
      } else if (complaint.assignedToType === 'team' && complaint.team) {
        const team = await Team.findById(complaint.team);
        if (team) {
          const warningNotifications = team.members.map((memberId) => ({
            user: memberId,
            title: '⚠️ Overdue Warning',
            message: `Your team had an overdue task: "${complaint.title}" which has been reassigned. Please ensure tasks are completed within the deadline in the future.`,
          }));
          await Notification.insertMany(warningNotifications);
        }
      }
    }
    
    complaint.assignedToType = assignedToType;
    complaint.status = 'assigned';
    complaint.assignedAt = Date.now();
    complaint.deadlineAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    if (assignedToType === 'individual') {
      complaint.worker = workerId;
      complaint.team = null;
      await Notification.create({
        user: workerId,
        title: 'Overdue Task Reassignment',
        message: `You have been reassigned an overdue cleanup: "${complaint.title}". Deadline: ${days} day(s).`,
      });
    } else {
      complaint.team = teamId;
      complaint.worker = null;
      const team = await Team.findById(teamId);
      if (team) {
        const notifications = team.members.map((memberId) => ({
          user: memberId,
          title: 'Overdue Team Reassignment',
          message: `Your team "${team.name}" has been reassigned an overdue cleanup: "${complaint.title}". Deadline: ${days} day(s).`,
        }));
        await Notification.insertMany(notifications);
      }
    }

    await complaint.save();

    // Socket emission for reassignment
    const io = req.app.get('io');
    if (io) {
      const title = assignedToType === 'individual' ? 'Overdue Task Reassignment' : 'Overdue Team Reassignment';
      const message = `You have been assigned a new cleanup: "${complaint.title}". Deadline: ${days} day(s).`;
      
      if (assignedToType === 'individual') {
        io.to(`user_${workerId}`).emit('new_task_assigned', { title, message, complaintId: complaint._id });
      } else {
        const team = await Team.findById(teamId);
        if (team && team.members) {
          team.members.forEach((memberId) => {
            io.to(`user_${memberId.toString()}`).emit('new_task_assigned', { 
              title, 
              message: `Your team "${team.name}" has been reassigned an overdue cleanup: "${complaint.title}". Deadline: ${days} day(s).`,
              complaintId: complaint._id 
            });
          });
        }
      }
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin verifies completed cleanup and awards points/bonuses
// @route   PUT /api/admin/complaints/:id/verify-cleanup
router.put('/complaints/:id/verify-cleanup', async (req, res) => {
  const { bonusAmount } = req.body;
  const bonus = parseFloat(bonusAmount) || 0;

  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email points badge');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'cleaned') {
      return res.status(400).json({ message: 'Cleanup cannot be verified unless marked as cleaned by worker' });
    }

    complaint.status = 'completed';
    complaint.completedAt = Date.now();
    complaint.bonusAmount = bonus;
    await complaint.save();

    // Reward reporting Citizen
    const citizen = await User.findById(complaint.citizen._id);
    if (citizen) {
      citizen.points += 50;
      citizen.badge = getBadge(citizen.points);
      await citizen.save();
    }

    // Award bonus/points to worker(s)
    if (complaint.assignedToType === 'team' && complaint.team) {
      const Team = require('../models/Team');
      const team = await Team.findById(complaint.team);
      if (team && team.members && team.members.length > 0) {
        const splitBonus = Number((bonus / team.members.length).toFixed(2));
        for (const memberId of team.members) {
          const memberUser = await User.findById(memberId);
          if (memberUser) {
            memberUser.points += 10;
            if (splitBonus > 0) {
              memberUser.bonusHistory.push({
                amount: splitBonus,
                complaint: complaint._id,
                date: Date.now(),
              });
            }
            await memberUser.save();

            // Notification to member
            await Notification.create({
              user: memberUser._id,
              title: 'Team Task Verified',
              message: `Your team cleaning for "${complaint.title}" was verified! Split bonus of $${splitBonus} awarded.`,
            });
          }
        }
      }
    } else if (complaint.worker) {
      const worker = await User.findById(complaint.worker);
      if (worker) {
        worker.points += 10; // 10 points
        if (bonus > 0) {
          worker.bonusHistory.push({
            amount: bonus,
            complaint: complaint._id,
            date: Date.now(),
          });
        }
        await worker.save();

        // Notification to worker
        await Notification.create({
          user: worker._id,
          title: 'Task Verified',
          message: `Your cleaning for "${complaint.title}" was verified! ${bonus > 0 ? `Dummy bonus of $${bonus} awarded.` : ''}`,
        });
      }
    }

    // In-app Notification to Citizen
    await Notification.create({
      user: complaint.citizen._id,
      title: 'Cleanup Resolved & Verified',
      message: `Great news! The garbage dump you reported "${complaint.title}" has been cleaned and verified. +50 Eco-Points awarded!`,
    });

    // Email Notification to Citizen (using Nodemailer)
    const emailSubject = `EcoClean Resolution: Waste Report Resolved!`;
    const emailText = `Dear ${complaint.citizen.name},\n\nThis is to confirm that the garbage dump you reported ("${complaint.title}") located at "${complaint.location.address}" has been successfully cleaned by our sanitation crew and verified by municipal administrators.\n\nThank you for contributing to keeping our community clean! You have been awarded 50 Eco-Points.\n\nBest regards,\nEcoClean Municipality Team`;
    
    await sendEmail({
      to: complaint.citizen.email,
      subject: emailSubject,
      text: emailText,
    });

    // Socket emission to citizen & worker/team
    const io = req.app.get('io');
    if (io) {
      // Notify citizen
      io.to(`user_${complaint.citizen._id.toString()}`).emit('complaint_completed', {
        title: 'Cleanup Resolved & Verified',
        message: `Great news! The garbage dump you reported "${complaint.title}" has been cleaned and verified. +50 Eco-Points awarded!`,
        points: 50,
        complaintId: complaint._id,
      });

      // Notify worker
      if (complaint.assignedToType === 'individual' && complaint.worker) {
        io.to(`user_${complaint.worker.toString()}`).emit('points_updated', {
          title: 'Task Verified',
          message: `Your cleaning for "${complaint.title}" was verified!`,
        });
      } else if (complaint.assignedToType === 'team' && complaint.team) {
        const team = await Team.findById(complaint.team);
        if (team && team.members) {
          team.members.forEach(memberId => {
            io.to(`user_${memberId.toString()}`).emit('points_updated', {
              title: 'Team Task Verified',
              message: `Your team cleaning for "${complaint.title}" was verified!`,
            });
          });
        }
      }
    }

    res.json({ message: 'Cleanup successfully verified!', complaint });
  } catch (error) {
    console.error('Error verifying cleanup:', error);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ANALYTICS & STATS
// ==========================================

// @desc    Get dashboard statistics for charts and cards
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      pending: 0,
      verified: 0,
      assigned: 0,
      in_progress: 0,
      cleaned: 0,
      completed: 0,
      rejected: 0,
    };
    statusStats.forEach((stat) => {
      statusCounts[stat._id] = stat.count;
    });

    const totalComplaints = await Complaint.countDocuments();

    const typeStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
        },
      },
    ]);

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

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const formattedMonthly = monthlyStats.map((stat) => ({
      name: `${monthNames[stat._id.month - 1]} ${stat._id.year}`,
      count: stat.count,
    }));

    const workerStats = await Complaint.aggregate([
      { $match: { status: 'completed', worker: { $ne: null } } },
      {
        $group: {
          _id: '$worker',
          completedCount: { $sum: 1 },
        },
      },
    ]);

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
