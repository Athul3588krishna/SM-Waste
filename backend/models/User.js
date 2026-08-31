const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address (e.g. user@example.com)',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    phone: {
      type: String,
      required: false,
      match: [
        /^[6-9]\d{9}$/,
        'Please add a valid 10-digit mobile number',
      ],
    },
    role: {
      type: String,
      required: [true, 'Please specify user role'],
      enum: ['citizen', 'admin', 'worker'],
      default: 'citizen',
    },
    points: {
      type: Number,
      default: 0, // Citizen Eco-points
    },
    badge: {
      type: String,
      default: 'Novice Reporter', // Citizen badge
    },
    // Worker specific attributes
    isOnline: {
      type: Boolean,
      default: false,
    },
    telegramChatId: {
      type: String,
      default: null,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    bonusHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        complaint: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Complaint',
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
