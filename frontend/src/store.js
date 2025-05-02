import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import tutorsReducer from './features/tutors/tutorsSlice';
import sessionsReducer from './features/sessions/sessionsSlice';
import paymentsReducer from './features/payments/paymentsSlice';
import feedbackReducer from './features/feedback/feedbackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tutors: tutorsReducer,
    sessions: sessionsReducer,
    payments: paymentsReducer,
    feedback: feedbackReducer,
  },
});