const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'tutor', 'admin'] },
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
  yearsOfExperience: { type: Number, default: 0 },
  gender: String,
  subjects: [String],
  specialties: [String],
  pricePerHour: Number,
  availability: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  rating: { type: Number, default: 0 },
  bio: String,
  totalSessions: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  academicLevel: String,
  department: String,
  certifications: [String],
  languages: [String],
  description: String,
  isVerified: { type: Boolean, default: false },
  isInitialFeePaid: { type: Boolean, default: false }, // New field for initial fee
});

module.exports = mongoose.model('User', userSchema);