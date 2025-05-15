const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

const register = async (req, res) => {
  const { name, email, password, role, gender, academicLevel, subjects, languages, pricePerHour, yearsOfExperience, specialties, bio, availability } = req.body;
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const trimmedPassword = password.trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const userData = {
      name,
      email: normalizedEmail,
      password: trimmedPassword,
      role,
      gender,
      academicLevel,
      subjects,
      languages,
      pricePerHour: pricePerHour ? Number(pricePerHour) : undefined,
      yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
      specialties,
      bio,
      availability,
    };
    return res.status(200).json({
      message: 'Please complete the payment of 50 ETB to proceed with registration',
      paymentRequired: true,
      userData,
    });
  } catch (error) {
    console.error('Error in register:', error.message, error.stack);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.log(`User not found for email: ${email}`);
        return res.status(400).json({ error: 'User not found' });
      }

      const trimmedPassword = password.trim();
      const isMatch = await bcrypt.compare(trimmedPassword, user.password);
      console.log('Password comparison:', { password: trimmedPassword, userPassword: user.password, isMatch });
      console.log('Password match:', isMatch);
      if (!isMatch) {
        console.log(`Password mismatch for email: ${email}`);
        return res.status(400).json({ error: 'Incorrect password' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ user, token });
    } catch (error) {
      console.error('Error in login:', error.message, error.stack);
      res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Profile update failed' });
    }
};

const verifyTutor = async (req, res) => {
    if (req.user.role !== 'tutor') return res.status(403).json({ error: 'Not a tutor' });
    try {
      const user = await User.findByIdAndUpdate(req.user._id, { isVerified: true }, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
};

const searchTutors = async (req, res) => {
  const { search, learningGoals, subjects, priceMin, priceMax, availability, rating, sortBy, page = 1, limit = 10 } = req.query;
  try {
    const query = { role: 'tutor' };
    console.log('Query params:', JSON.stringify(req.query, null, 2));

    // Array to hold filter conditions
    const filterConditions = [];

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();
      console.log('Search term:', searchTerm);
      filterConditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { subjects: { $regex: searchTerm, $options: 'i' } },
          { bio: { $regex: searchTerm, $options: 'i' } },
        ],
      });
    }

    // Subjects filter
    if (subjects) {
      const subjectsArray = Array.isArray(subjects) ? subjects : subjects.split(',').map(s => s.trim());
      console.log('Subjects array:', subjectsArray);
      filterConditions.push({ subjects: { $in: subjectsArray } });
    }

    // Learning goals filter
    if (learningGoals) {
      const goalsArray = Array.isArray(learningGoals) ? learningGoals : learningGoals.split(',').map(g => g.trim());
      console.log('Learning goals array:', goalsArray);
      filterConditions.push({ specialties: { $in: goalsArray } });
    }

    // Price range filter
    if (priceMin || priceMax) {
      const priceFilter = {
        pricePerHour: {
          $gte: priceMin ? Number(priceMin) : 0,
          $lte: priceMax ? Number(priceMax) : Infinity,
        },
      };
      console.log('Price query:', JSON.stringify(priceFilter, null, 2));
      filterConditions.push(priceFilter);
    }

    // Availability filter
    if (availability) {
      const availabilityArray = Array.isArray(availability) ? availability : availability.split(',').map(d => d.trim());
      console.log('Availability array:', availabilityArray);
      filterConditions.push({ 'availability.day': { $in: availabilityArray } });
    }

    // Rating filter
    if (rating) {
      const minRating = Number(rating);
      if (!isNaN(minRating)) {
        console.log('Rating query:', { rating: { $gte: minRating } });
        filterConditions.push({ rating: { $gte: minRating } });
      }
    }

    // Combine filter conditions with $or if any exist
    if (filterConditions.length > 0) {
      query.$or = filterConditions;
    }
    console.log('Final query:', JSON.stringify(query, null, 2));

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalTutors = await User.countDocuments(query);
    console.log('Total tutors matching query:', totalTutors);

    let tutorsQuery = User.find(query)
      .skip(skip)
      .limit(limitNum);

    if (sortBy === 'priceLowToHigh') {
      tutorsQuery = tutorsQuery.sort({ pricePerHour: 1 });
    } else if (sortBy === 'priceHighToLow') {
      tutorsQuery = tutorsQuery.sort({ pricePerHour: -1 });
    } else {
      tutorsQuery = tutorsQuery.sort({ rating: -1 });
    }

    const tutors = await tutorsQuery.exec();
    console.log('Fetched tutors:', JSON.stringify(tutors, null, 2));

    const sessionCounts = await Session.aggregate([
      { $match: { status: 'completed', tutorId: { $in: tutors.map(t => t._id) } } },
      { $group: { _id: '$tutorId', totalSessions: { $sum: 1 } } },
    ]);

    const sessionCountMap = sessionCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.totalSessions;
      return acc;
    }, {});

    const tutorsWithSessions = tutors.map(tutor => ({
      ...tutor.toObject(),
      totalSessions: sessionCountMap[tutor._id.toString()] || 0,
    }));

    const response = {
      tutors: tutorsWithSessions,
      totalTutors,
      currentPage: pageNum,
      totalPages: Math.ceil(totalTutors / limitNum),
      limit: limitNum,
    };
    console.log('Response sent:', JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error('Error in searchTutors:', error.message, error.stack);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

const getTutorEarnings = async (req, res) => {
    try {
      console.log('Fetching earnings for tutor:', req.user._id);
      const tutorId = req.user._id;

      const sessions = await Session.find({ tutorId }).select('_id');
      const sessionIds = sessions.map(session => session._id);
      console.log('Tutor session IDs:', sessionIds);

      const payments = await Payment.find({ 
        sessionId: { $in: sessionIds },
        status: 'completed' 
      })
        .populate('sessionId', 'subject studentId')
        .populate('studentId', 'name');

      console.log('Raw payments:', payments);

      const earnings = payments.map(payment => {
        const commissionRate = 0.3;
        const total = payment.amount;
        const commission = total * commissionRate;
        const net = total - commission;
        return {
          student: payment.studentId?.name || 'Unknown Student',
          subject: payment.sessionId?.subject || 'Unknown Subject',
          total,
          commission,
          net,
        };
      });

      console.log('Processed earnings:', earnings);
      res.json(earnings);
    } catch (error) {
      console.error('Error in getTutorEarnings:', error.message);
      res.status(500).json({ error: 'Failed to fetch earnings', details: error.message });
    }
};

const getTutorReviews = async (req, res) => {
    try {
      console.log('Fetching reviews for tutor:', req.user._id);
      const reviews = await Review.find({ tutorId: req.user._id })
        .populate('studentId', 'name')
        .populate('sessionId', 'subject');
      console.log('Fetched reviews:', reviews);

      const formattedReviews = reviews.map(review => ({
        student: review.studentId?.name || 'Unknown Student',
        comment: review.comment,
        rating: review.rating,
        subject: review.sessionId?.subject || 'Unknown Subject',
      }));

      res.json(formattedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
    }
};

const getTutorById = async (req, res) => {
    try {
      const tutor = await User.findById(req.params.id);
      if (!tutor || tutor.role !== 'tutor') {
        return res.status(404).json({ error: 'Tutor not found' });
      }
      res.json(tutor);
    } catch (error) {
      console.error('Error in getTutorById:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to fetch tutor', details: error.message });
    }
};

const createSession = async (req, res) => {
    const { tutorId, selectedTime, selectedDuration, subject, selectedDate } = req.body;
    try {
      console.log('createSession request body:', req.body);

      if (!req.user || !req.user.role) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Only students can book sessions' });
      }

      if (!tutorId || !selectedTime || !selectedDuration || !subject || !selectedDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const tutor = await User.findById(tutorId);
      if (!tutor || tutor.role !== 'tutor') {
        return res.status(404).json({ error: 'Tutor not found' });
      }

      const timeParts = selectedTime.split(' ');
      if (timeParts.length !== 2) {
        return res.status(400).json({ error: 'Invalid selectedTime format. Expected "Day HH:MM"' });
      }
      const [day, startTime] = timeParts;

      const duration = Number(selectedDuration);
      if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({ error: 'Invalid duration' });
      }

      const startDateTime = new Date(`${selectedDate}T${startTime}:00`);
      if (isNaN(startDateTime.getTime())) {
        return res.status(400).json({ error: 'Invalid date or time format' });
      }

      const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
      const dateStr = selectedDate;

      const existingSessions = await Session.find({
        tutorId,
        date: dateStr,
        $or: [
          {
            startTime: { $lt: endDateTime, $gte: startDateTime },
          },
          {
            endTime: { $gt: startDateTime, $lte: endDateTime },
          },
        ],
      });

      if (existingSessions.length > 0) {
        return res.status(400).json({ error: 'This time slot is already booked' });
      }

      const session = new Session({
        studentId: req.user._id,
        tutorId,
        subject,
        date: dateStr,
        startTime: startDateTime,
        endTime: endDateTime,
        pricePerHour: tutor.pricePerHour,
        duration,
        status: 'scheduled',
      });

      await session.save();
      res.status(201).json({ session });
    } catch (error) {
      console.error('Error in createSession:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to create session', details: error.message });
    }
};

const confirmSession = async (req, res) => {
    try {
      console.log('Confirming session with ID:', req.params.id);
      console.log('Authenticated user:', req.user?._id || 'User not authenticated');

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log('Invalid session ID format');
        return res.status(400).json({ error: 'Invalid session ID' });
      }

      const session = await Session.findById(req.params.id)
        .populate('studentId', '_id')
        .populate('tutorId', '_id');
      if (!session) {
        console.log('Session not found in database');
        return res.status(404).json({ error: 'Session not found' });
      }
      console.log('Found session:', session);

      if (!req.user || !req.user._id) {
        console.log('No authenticated user');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const isStudent = session.studentId._id.toString() === req.user._id.toString();
      const isTutor = session.tutorId._id.toString() === req.user._id.toString();
      console.log('Is student:', isStudent, 'Is tutor:', isTutor);

      if (!isStudent && !isTutor) {
        console.log('Unauthorized user attempt');
        return res.status(403).json({ error: 'Unauthorized to confirm this session' });
      }

      if (session.status !== 'scheduled') {
        console.log('Session status:', session.status);
        return res.status(400).json({ error: 'Session is not in a scheduled state' });
      }

      if (isStudent) {
        if (session.studentConfirmed) {
          return res.status(400).json({ error: 'Student has already confirmed this session' });
        }
        session.studentConfirmed = true;
        console.log('Student confirmed:', session.studentConfirmed);
      } else if (isTutor) {
        if (session.tutorConfirmed) {
          return res.status(400).json({ error: 'Tutor has already confirmed this session' });
        }
        session.tutorConfirmed = true;
        console.log('Tutor confirmed:', session.tutorConfirmed);
      }

      if (session.studentConfirmed && session.tutorConfirmed) {
        session.status = 'confirmed';
        console.log('Both confirmed, updating status to confirmed');
      }

      await session.save();
      console.log('Session saved successfully:', session);

      res.json({ session, message: 'Session confirmation updated successfully' });
    } catch (error) {
      console.error('Error in confirmSession:', {
        message: error.message,
        stack: error.stack,
        sessionId: req.params.id,
      });
      res.status(500).json({ error: 'Failed to confirm session', details: error.message });
    }
};

const getTutorSessions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user._id; // Use authenticated user's ID
    const sessions = await Session.find({ tutorId: userId })
      .populate('tutorId', 'name')
      .populate('studentId', 'name')
      .lean();
      console.log('Fetched tutor sessions:', sessions);
      if (!sessions) {
        return res.json([]);
      }
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions', details: error.message });
  }
};

const processPayment = async (req, res) => {
    const { sessionId, tutorId, studentId, amount, paymentMethod } = req.body;
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (session.studentId.toString() !== studentId) {
        return res.status(403).json({ error: 'Unauthorized to process payment for this session' });
      }

      if (session.status !== 'scheduled') {
        return res.status(400).json({ error: 'Session is not in a scheduled state' });
      }

      const platformFeeRate = 0.3;
      const platformFee = amount * platformFeeRate;
      const tutorEarnings = amount - platformFee;

      const payment = new Payment({
        sessionId,
        tutorId,
        studentId,
        amount,
        platformFee,
        tutorEarnings,
        status: 'pending',
        paymentMethod,
        paymentDate: new Date(),
      });

      const paymentSuccess = true;
      if (!paymentSuccess) {
        payment.status = 'failed';
        await payment.save();
        return res.status(400).json({ error: 'Payment failed' });
      }

      payment.status = 'completed';
      await payment.save();

      res.json({ payment, message: 'Payment processed successfully' });
    } catch (error) {
      console.error('Error in processPayment:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to process payment', details: error.message });
    }
};

const getStudentSessions = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = req.user._id;
      const sessions = await Session.find({ studentId: userId })
        .populate('tutorId', 'name')
        .lean();
      if (!sessions) {
        return res.json([]);
      }
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch student sessions', details: error.message });
    }
};

const getStudentReviews = async (req, res) => {
    try {
      const userId = req.user._id;
      const reviews = await Review.find({ studentId: userId })
        .populate('tutorId', 'name')
        .lean();
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching student reviews:', error);
      res.status(500).json({ error: 'Failed to fetch student reviews' });
    }
};

const getSessionById = async (req, res) => {
    try {
      const session = await Session.findById(req.params.id)
        .populate('tutorId', 'name')
        .populate('studentId', 'name')
        .lean();
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error in getSessionById:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to fetch session', details: error.message });
    }
};

const getSessions = async (req, res) => {
    try {
      console.log('Fetching all sessions');
      const sessions = await Session.find()
        .populate('tutorId', 'name')
        .populate('studentId', 'name')
        .lean();
      console.log('Fetched sessions:', sessions);
      res.json(sessions);
    } catch (error) {
      console.error('Error in getSessions:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to fetch sessions', details: error.message });
    }
};

const submitReview = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;
    const studentId = req.user._id;
    console.log('Submitting review:', { sessionId, studentId, user: req.user });

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const session = await Session.findById(sessionId)
      .populate('tutorId', '_id')
      .populate('studentId', '_id');
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    console.log('Session data:', { sessionId: session._id, studentId: session.studentId._id, status: session.status });

    if (session.studentId._id.toString() !== studentId) {
      return res.status(403).json({ error: 'You are not authorized to review this session' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Session must be completed to submit a review' });
    }

    const existingReview = await Review.findOne({ sessionId, studentId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this session' });
    }

    const review = new Review({
      tutorId: session.tutorId._id,
      studentId,
      sessionId,
      rating,
      comment,
    });

    await review.save();
    console.log('Review submitted:', review);
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error submitting review:', error.message);
    res.status(500).json({ error: 'Failed to submit review', details: error.message });
  }
};

const startCallSession = async (req, res) => {
    try {
      const sessionId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({ error: 'Invalid session ID' });
      }

      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (
        session.studentId.toString() !== req.user._id.toString() &&
        session.tutorId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ error: 'Unauthorized to start this session call' });
      }

      if (session.status !== 'confirmed') {
        return res.status(400).json({ error: 'Session must be confirmed to start the call' });
      }

      session.callStatus = 'active';
      await session.save();

      // Emit Socket.IO event to notify all participants
      const io = req.app.get('socketio');
      io.to(sessionId).emit('callStatusUpdate', { callStatus: 'active' });

      res.json({ message: 'Call started', session });
    } catch (error) {
      console.error('Error starting call session:', error.message);
      res.status(500).json({ error: 'Failed to start call', details: error.message });
    }
};

const completeSession = async (req, res) => {
    try {
      const sessionId = req.params.id;
      const userId = req.user._id;

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({ error: 'Invalid session ID' });
      }

      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (
        session.studentId.toString() !== userId.toString() &&
        session.tutorId.toString() !== userId.toString()
      ) {
        return res.status(403).json({ error: 'Unauthorized to update this session' });
      }

      if (session.status !== 'confirmed') {
        return res.status(400).json({ error: 'Session must be confirmed to mark as completed' });
      }

      session.status = 'completed';
      session.callStatus = 'ended';
      await session.save();
      console.log('Session marked as completed:', session);

      // Emit Socket.IO event to notify all participants
      const io = req.app.get('socketio');
      io.to(sessionId).emit('callStatusUpdate', { callStatus: 'ended' });

      res.json({ message: 'Session marked as completed' });
    } catch (error) {
      console.error('Error marking session as completed:', error.message);
      res.status(500).json({ error: 'Failed to mark session as completed', details: error.message });
    }
};

const getFilterOptions = async (req, res) => {
  try {
    const subjects = await User.distinct("subjects", { role: "tutor" });
    const specialties = await User.distinct("specialties", { role: "tutor" });
    const availabilityDays = await User.distinct("availability.day", { role: "tutor" });

    const response = {
      subjects: subjects.filter(s => s),
      learningGoals: specialties.filter(s => s),
      days: availabilityDays.filter(d => d),
    };
    console.log('Filter options response:', JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error('Error fetching filter options:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch filter options', details: error.message });
  }
};

const processSignupPayment = async (req, res) => {
  const { userData, paymentMethod, paymentAmount } = req.body;
  try {
    if (paymentAmount !== 50) {
      return res.status(400).json({ error: 'Payment amount must be 50 ETB for signup' });
    }

    console.log('Processing signup payment for user:', userData.email, 'Amount:', paymentAmount);
    const paymentSuccess = true;
    if (!paymentSuccess) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = new User({
      ...userData,
      password: hashedPassword,
      isInitialFeePaid: true,
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Payment successful, user registered', token });
  } catch (error) {
    console.error('Error in processSignupPayment:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to process payment', details: error.message });
  }
};

module.exports = { 
    register, 
    login, 
    updateProfile, 
    verifyTutor, 
    searchTutors, 
    getTutorEarnings, 
    getTutorReviews, 
    getTutorById, 
    createSession, 
    confirmSession,
    getTutorSessions,
    processPayment,
    getStudentSessions, 
    getStudentReviews,
    getSessionById,
    getSessions,
    submitReview,
    startCallSession,
    completeSession,
    getFilterOptions,
    processSignupPayment
};