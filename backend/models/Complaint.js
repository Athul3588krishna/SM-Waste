const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous', 'Mixed'],
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
      enum: ['pending', 'verified', 'assigned', 'completed', 'rejected'],
      default: 'pending',
    },
    assignedAt: {
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
