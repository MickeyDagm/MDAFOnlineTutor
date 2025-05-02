// controllers/paymentController.js
const Payment = require('../models/Payment');
const Session = require('../models/Session');
const User = require('../models/User');

const processPayment = async (req, res) => {
  const { sessionId, paymentMethod } = req.body;
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Not a student' });

  try {
    const session = await Session.findById(sessionId).populate('tutorId');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const amount = session.tutorId.pricePerHour * ((new Date(session.endTime) - new Date(session.startTime)) / 3600000);
    const platformFee = amount * 0.3; // 30% commission
    const tutorEarnings = amount - platformFee;

    const payment = new Payment({
      sessionId,
      tutorId: session.tutorId._id,
      studentId: req.user._id,
      amount,
      platformFee,
      tutorEarnings,
      status: 'completed',
      paymentMethod,
      paymentDate: new Date(),
    });

    await payment.save();
    session.paymentStatus = 'paid';
    await session.save();

    await User.findByIdAndUpdate(session.tutorId._id, {
      $inc: { totalSessions: 1, totalStudents: session.studentId.toString() === session.tutorId.totalStudents ? 0 : 1 },
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

module.exports = { processPayment };