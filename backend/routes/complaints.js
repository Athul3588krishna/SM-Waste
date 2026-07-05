const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');
const { upload, uploadImage } = require('../middleware/upload');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen only, though any logged in user can report if needed)
router.post('/', protect, upload.single('photo'), uploadImage, async (req, res) => {
  const { title, description, latitude, longitude, address, wasteType, severity } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo of the waste dump' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location latitude and longitude are required' });
    }

    const complaint = await Complaint.create({
      citizen: req.user._id,
      title,
      description,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || 'Location specified on map',
      },
      wasteType: wasteType || 'Mixed',
      severity: severity || 'Medium',
      photoBefore: req.file.uploadedUrl,
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get complaints submitted by the logged-in citizen
// @route   GET /api/complaints/citizen
// @access  Private
router.get('/citizen', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user._id })
      .sort({ createdAt: -1 })
      .populate('worker', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get complaint details by ID
// @route   GET /api/complaints/detail/:id
// @access  Private
router.get('/detail/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email badge points')
      .populate('worker', 'name email points');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
