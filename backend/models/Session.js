const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  studentConfirmed: {
    type: Boolean,
    default: false,
  },
  tutorConfirmed: {
    type: Boolean,
    default: false,
  },
  callStatus: { // Add callStatus field
    type: String,
    enum: ['inactive', 'active', 'ended'],
    default: 'inactive',
  },
});

module.exports = mongoose.model('Session', sessionSchema);