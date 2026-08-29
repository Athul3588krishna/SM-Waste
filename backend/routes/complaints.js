const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload, uploadImage } = require('../middleware/upload');
const {
  analyzeWastePhoto,
  createComplaint,
  getCitizenComplaints,
  getComplaintById,
  chatWithEcoBot,
} = require('../controllers/complaintController');

// @desc    Analyze uploaded image for waste classification using Gemini API
// @route   POST /api/complaints/analyze
// @access  Private
router.post('/analyze', protect, upload.single('photo'), analyzeWastePhoto);

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen only, though any logged in user can report if needed)
router.post('/', protect, upload.single('photo'), uploadImage, createComplaint);

// @desc    Get complaints submitted by the logged-in citizen
// @route   GET /api/complaints/citizen
// @access  Private
router.get('/citizen', protect, getCitizenComplaints);

// @desc    Get complaint details by ID
// @route   GET /api/complaints/detail/:id
// @access  Private
router.get('/detail/:id', protect, getComplaintById);

// @desc    Chat with EcoBot AI helper
// @route   POST /api/complaints/chat
// @access  Public
router.post('/chat', chatWithEcoBot);

module.exports = router;
