// controllers/sessionController.js
const Session = require('../models/Session');
const User = require('../models/User');

const scheduleSession = async (req, res) => {
  const { tutorId, subject, startTime, endTime, sessionType, groupSize } = req.body;
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Not a student' });

  try {
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== 'tutor') return res.status(404).json({ error: 'Tutor not found' });

    const isAvailable = tutor.availability.some(slot => {
      const slotStart = new Date(`${startTime.split('T')[0]}T${slot.startTime}:00`);
      const slotEnd = new Date(`${startTime.split('T')[0]}T${slot.endTime}:00`);
      return new Date(startTime) >= slotStart && new Date(endTime) <= slotEnd;
    });

    if (!isAvailable) return res.status(400).json({ error: 'Tutor not available' });

    const session = new Session({
      tutorId,
      studentId: req.user._id,
      subject,
      startTime,
      endTime,
      sessionType,
      groupSize: sessionType === 'group' ? groupSize : 1,
      status: 'scheduled',
      paymentStatus: 'pending',
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Session scheduling failed' });
  }
};

const getSessions = async (req, res) => {
  try {
    const query = req.user.role === 'tutor' ? { tutorId: req.user._id } : { studentId: req.user._id };
    const sessions = await Session.find(query).populate('tutorId studentId');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (session.studentId.toString() !== req.user._id.toString() && session.tutorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    session.status = 'cancelled';
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Session cancellation failed' });
  }
};

module.exports = { scheduleSession, getSessions, cancelSession };