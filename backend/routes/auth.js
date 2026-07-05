const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_token_for_smart_waste_management_123456', {
    expiresIn: '30d',
  });
};

// @desc    Register a new citizen
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'citizen',
      points: 0,
      badge: 'Novice Reporter',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badge: user.badge,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
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
    const user = await User.findOne({ email }).select('+password');

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

// @desc    Google Sign-In / Sign-Up Integration (Simulated OAuth)
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists (Sign-Up via Google)
      // Generate a random password for Google registered users
      const randomPassword = Math.random().toString(36).substring(2, 10);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: 'citizen', // Google sign in users are always citizens by default
        points: 0,
        badge: 'Novice Reporter',
      });
    }

    res.json({
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

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
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

module.exports = router;
