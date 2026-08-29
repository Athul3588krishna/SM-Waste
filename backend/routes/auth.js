const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getLeaderboard,
  redeemPoints,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// @desc    Register a new citizen (Generates & Sends Email OTP)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', verifyOtp);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @desc    Get leaderboard data
// @route   GET /api/auth/leaderboard
// @access  Private
router.get('/leaderboard', protect, getLeaderboard);

// @desc    Redeem points for tax vouchers
// @route   PUT /api/auth/redeem
// @access  Private
router.put('/redeem', protect, redeemPoints);

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', forgotPassword);

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', resetPassword);

module.exports = router;
