const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedToType: {
      type: String,
      enum: ['individual', 'team', null],
      default: null,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Please add a title for the waste report'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        default: 'Location specified on map',
      },
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous', 'Mixed', 'Medical'],
      default: 'Mixed',
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    photoBefore: {
      type: String,
      required: [true, 'Please upload a photo of the waste dump'],
    },
    photoAfter: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'assigned', 'in_progress', 'cleaned', 'completed', 'rejected'],
      default: 'pending',
    },
    deadlineAt: {
      type: Date,
      default: null,
    },
    bonusAmount: {
      type: Number,
      default: 0,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    cleanedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
