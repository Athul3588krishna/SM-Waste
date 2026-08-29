const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload, uploadImage } = require('../middleware/upload');
const {
  getWorkerComplaints,
  updateWorkerAvailability,
  acceptTask,
  submitCleanupPhoto,
} = require('../controllers/workerController');

// Apply protection and Worker role verification to all routes in this file
router.use(protect);
router.use(authorize('worker'));

// @desc    Get all complaints assigned to the worker (either individually or to their team)
// @route   GET /api/worker/complaints
router.get('/complaints', getWorkerComplaints);

// @desc    Switch worker availability (Online / Offline)
// @route   PUT /api/worker/availability
router.put('/availability', updateWorkerAvailability);

// @desc    Accept assigned task (Assigned -> In Progress)
// @route   PUT /api/worker/complaints/:id/accept
router.put('/complaints/:id/accept', acceptTask);

// @desc    Worker uploads clean up photo (In Progress -> Cleaned)
// @route   PUT /api/worker/complaints/:id/clean
router.put('/complaints/:id/clean', upload.single('photo'), uploadImage, submitCleanupPhoto);

module.exports = router;
