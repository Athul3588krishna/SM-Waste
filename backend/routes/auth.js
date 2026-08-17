const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/emailService');
const { protect } = require('../middleware/auth');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_token_for_smart_waste_management_123456', {
    expiresIn: '30d',
  });
};

// @desc    Register a new citizen (Generates & Sends Email OTP)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Validate Email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address (e.g. name@example.com)' });
    }

    // Validate Password (min 6 chars, no spaces)
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (/\s/.test(password)) {
      return res.status(400).json({ message: 'Password cannot contain spaces' });
    }

    // Validate 10-digit mobile number if provided
    if (phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Mobile number must be a valid 10-digit number starting with 6, 7, 8, or 9' });
      }
    }

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to pending OTP collection (expiring in 5 minutes)
    await Otp.deleteMany({ email: cleanEmail }); // clean previous attempts
    await Otp.create({
      name,
      email: cleanEmail,
      password,
      phone,
      otp,
    });

    // Send OTP to email
    await sendEmail({
      to: email,
      subject: 'EcoClean Account Verification OTP',
      text: `Dear ${name},\n\nThank you for registering on EcoClean. Please use the following 6-digit One Time Password (OTP) to verify and activate your account:\n\n${otp}\n\nThis OTP is valid for 5 minutes.\n\nBest regards,\nEcoClean Municipality Team`,
    });

    res.status(200).json({ message: 'OTP sent to email. Please verify.', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    // Create verified User
    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      phone: otpRecord.phone,
      role: 'citizen',
      points: 0,
      badge: 'Novice Reporter',
    });

    // Clean up OTP document
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points,
      badge: user.badge,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badge: user.badge,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('team', 'name');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      points: updatedUser.points,
      badge: updatedUser.badge,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get leaderboard data
// @route   GET /api/auth/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const topCitizens = await User.find({ role: 'citizen' })
      .sort({ points: -1 })
      .limit(10)
      .select('name email points badge');

    const topWorkers = await User.find({ role: 'worker' })
      .sort({ points: -1 })
      .limit(10)
      .select('name email points');

    res.json({
      citizens: topCitizens,
      workers: topWorkers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Redeem points for tax vouchers
// @route   PUT /api/auth/redeem
// @access  Private
router.put('/redeem', protect, async (req, res) => {
  const { pointsToDeduct, voucherName } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.points < pointsToDeduct) {
      return res.status(400).json({ message: 'Insufficient Eco-Points' });
    }

    user.points -= pointsToDeduct;
    
    // Recalculate badge based on new points count
    const getBadge = (pts) => {
      if (pts >= 300) return 'Green Champion';
      if (pts >= 100) return 'Eco Sentinel';
      return 'Novice Reporter';
    };
    user.badge = getBadge(user.points);
    await user.save();

    // Create Notification
    const Notification = require('../models/Notification');
    await Notification.create({
      user: user._id,
      title: 'Voucher Redeemed 🎁',
      message: `Successfully redeemed ${pointsToDeduct} Eco-Points for "${voucherName}". Your coupon is now active!`,
    });

    res.json({
      message: 'Points redeemed successfully',
      points: user.points,
      badge: user.badge
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email address' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean previous attempts and save to Otp collection
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({
      email: cleanEmail,
      otp,
      name: user.name,
      password: 'RESET_PASSWORD_DUMMY'
    });

    // Send OTP to user's email
    await sendEmail({
      to: email,
      subject: 'EcoClean Password Reset OTP',
      text: `Dear ${user.name},\n\nYou requested a password reset. Please use the following 6-digit One Time Password (OTP) to reset your account password:\n\n${otp}\n\nThis OTP is valid for 5 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nEcoClean Municipality Team`,
    });

    res.json({ message: 'Password reset OTP sent to email', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const otpRecord = await Otp.findOne({ email: cleanEmail, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set new password (pre-save hook in User model will automatically encrypt it)
    user.password = newPassword;
    await user.save();

    // Delete OTP record
    await Otp.deleteMany({ email: cleanEmail });

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
