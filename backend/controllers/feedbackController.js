// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const Session = require('../models/Session');
const User = require('../models/User');

const submitFeedback = async (req, res) => {
  const { sessionId, rating, comment } = req.body;
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Not a student' });

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.studentId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });

    const feedback = new Feedback({
      sessionId,
      tutorId: session.tutorId,
      studentId: req.user._id,
      rating,
      comment,
    });

    await feedback.save();
    session.rating = rating;
    session.review = comment;
    await session.save();

    const feedbacks = await Feedback.find({ tutorId: session.tutorId });
    const avgRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length;
    await User.findByIdAndUpdate(session.tutorId, { rating: avgRating });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Feedback submission failed' });
  }
};

module.exports = { submitFeedback };