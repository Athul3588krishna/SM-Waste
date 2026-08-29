const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam,
  createAnnouncement,
  getAdminComplaints,
  verifyOrRejectComplaint,
  assignComplaint,
  reassignComplaint,
  verifyCleanup,
  getAdminStats,
} = require('../controllers/adminController');

// Apply protection and Admin role verification to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// WORKER CRUD ENDPOINTS
router.post('/workers', createWorker);
router.get('/workers', getWorkers);
router.put('/workers/:id', updateWorker);
router.delete('/workers/:id', deleteWorker);

// CLEANING TEAMS CRUD ENDPOINTS
router.post('/teams', createTeam);
router.get('/teams', getTeams);
router.put('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);

// ANNOUNCEMENTS ENDPOINTS
router.post('/announcements', createAnnouncement);

// COMPLAINT WORKFLOW MANAGEMENT
router.get('/complaints', getAdminComplaints);
router.put('/complaints/:id/status', verifyOrRejectComplaint);
router.put('/complaints/:id/assign', assignComplaint);
router.put('/complaints/:id/reassign', reassignComplaint);
router.put('/complaints/:id/verify-cleanup', verifyCleanup);

// ANALYTICS & STATS
router.get('/stats', getAdminStats);

module.exports = router;
