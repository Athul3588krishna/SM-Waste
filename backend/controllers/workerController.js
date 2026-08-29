const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get all complaints assigned to the worker (either individually or to their team)
// @route   GET /api/worker/complaints
const getWorkerComplaints = async (req, res) => {
  try {
    // A worker can see complaints assigned to them individually OR to their team
    const query = {
      $or: [
        { worker: req.user._id },
      ],
    };

    if (req.user.team) {
      query.$or.push({ team: req.user.team });
    }

    const complaints = await Complaint.find(query)
      .sort({ updatedAt: -1 })
      .populate('citizen', 'name email badge')
      .populate('team', 'name');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Switch worker availability (Online / Offline)
// @route   PUT /api/worker/availability
const updateWorkerAvailability = async (req, res) => {
  const { isOnline } = req.body;

  if (typeof isOnline !== 'boolean') {
    return res.status(400).json({ message: 'isOnline value must be boolean' });
  }

  try {
    const worker = await User.findById(req.user._id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    worker.isOnline = isOnline;
    await worker.save();

    res.json({ message: `Availability status updated to ${isOnline ? 'Online' : 'Offline'}`, isOnline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept assigned task (Assigned -> In Progress)
// @route   PUT /api/worker/complaints/:id/accept
const acceptTask = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Verify it is assigned to this worker or their team
    const isAssignedToUser = complaint.worker && complaint.worker.toString() === req.user._id.toString();
    const isAssignedToTeam = complaint.team && req.user.team && complaint.team.toString() === req.user.team.toString();

    if (!isAssignedToUser && !isAssignedToTeam) {
      return res.status(403).json({ message: 'You are not authorized to accept this task' });
    }

    if (complaint.status !== 'assigned') {
      return res.status(400).json({ message: 'Task is not in assigned state' });
    }

    complaint.status = 'in_progress';
    // If it was assigned to a team, record which specific worker accepted/is doing it
    complaint.worker = req.user._id;
    await complaint.save();

    // Socket emission to admin and citizen
    const io = req.app.get('io');
    if (io) {
      const title = 'Task In Progress 🛠️';
      const message = `Sanitation worker ${req.user.name} has started working on "${complaint.title}".`;
      
      // Notify admin
      io.to('admin').emit('task_in_progress', { title, message, complaintId: complaint._id, status: 'in_progress', workerName: req.user.name });

      // Notify citizen
      io.to(`user_${complaint.citizen.toString()}`).emit('complaint_status_updated', {
        title: 'Cleanup Started',
        message: `Sanitation crew is on site and working on "${complaint.title}".`,
        complaintId: complaint._id,
        status: 'in_progress'
      });

      io.emit('complaint_updated', { complaintId: complaint._id, status: 'in_progress' });
    }

    res.json({ message: 'Task accepted successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Worker uploads clean up photo (In Progress -> Cleaned)
// @route   PUT /api/worker/complaints/:id/clean
const submitCleanupPhoto = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Verify worker association
    const isAssignedToUser = complaint.worker && complaint.worker.toString() === req.user._id.toString();
    const isAssignedToTeam = complaint.team && req.user.team && complaint.team.toString() === req.user.team.toString();

    if (!isAssignedToUser && !isAssignedToTeam) {
      return res.status(403).json({ message: 'You are not authorized to clean this task' });
    }

    if (complaint.status !== 'in_progress') {
      return res.status(400).json({ message: 'Task must be In Progress to submit cleanup' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an after-cleaning photo' });
    }

    complaint.photoAfter = req.file.uploadedUrl;
    complaint.status = 'cleaned'; // Wait for Admin Verification
    complaint.cleanedAt = Date.now();
    await complaint.save();

    // Socket emission to admin & citizen
    const io = req.app.get('io');
    if (io) {
      const title = 'Cleanup Submitted';
      const message = `Worker completed cleanup for: "${complaint.title}". Awaiting verification.`;
      
      // Notify admins
      io.to('admin').emit('task_cleaned', { title, message, complaintId: complaint._id });

      // Notify citizen
      io.to(`user_${complaint.citizen.toString()}`).emit('complaint_status_updated', {
        title: 'Cleanup Work Finished',
        message: `Sanitation crew has cleaned "${complaint.title}"! Awaiting municipal verification.`,
        complaintId: complaint._id,
        status: 'cleaned'
      });

      io.emit('complaint_updated', { complaintId: complaint._id, status: 'cleaned' });
    }

    res.json({ message: 'Task marked as cleaned. Awaiting administrator verification.', complaint });
  } catch (error) {
    console.error('Error uploading cleanup:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkerComplaints,
  updateWorkerAvailability,
  acceptTask,
  submitCleanupPhoto,
};
