const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/tutor/verify', authMiddleware, userController.verifyTutor);

router.get('/tutors', userController.searchTutors);
router.get('/tutor/earnings', authMiddleware, userController.getTutorEarnings);
router.get('/tutor/reviews', authMiddleware, userController.getTutorReviews);
router.get('/tutor/sessions', authMiddleware, userController.getTutorSessions);
router.get('/tutor/:id', authMiddleware, userController.getTutorById);


router.get('/student/sessions', authMiddleware, userController.getStudentSessions);
router.get('/student/reviews', authMiddleware, userController.getStudentReviews);

router.post('/sessions', authMiddleware, userController.createSession);
router.post('/sessions/:id/confirm', authMiddleware, userController.confirmSession);
router.post('/sessions/:id/start-call', authMiddleware, userController.startCallSession); // New route

router.post('/payments', authMiddleware, userController.processPayment);
router.post('/signup-payment', userController.processSignupPayment);

router.get('/sessions/:id', authMiddleware, userController.getSessionById);
router.get('/sessions', authMiddleware, userController.getSessions);
router.post('/submit-review', authMiddleware, userController.submitReview);
router.put('/sessions/:id/complete', authMiddleware, userController.completeSession);

router.get('/filter-options', userController.getFilterOptions);



module.exports = router;