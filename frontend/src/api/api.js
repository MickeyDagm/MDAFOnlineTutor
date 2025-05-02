import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => api.post('/register', userData);
export const login = (credentials) => api.post('/login', credentials);
export const updateProfile = (profileData) => api.put('/profile', profileData);
export const verifyTutor = () => api.post('/tutor/verify');

export const searchTutors = (params) => api.get('/tutors', { params });
export const getTutorEarnings = () => api.get('/tutor/earnings');
export const getTutorReviews = () => api.get('/tutor/reviews');

export const getStudentSessions = () => api.get('/student/sessions');
export const getStudentReviews = () => api.get('/student/reviews');

export const scheduleSession = (sessionData) => api.post('/sessions', sessionData);
export const getSessions = () => api.get('/sessions');
export const cancelSession = (sessionId) => api.put(`/sessions/${sessionId}/cancel`);

export const processPayment = (paymentData) => api.post('/payments', paymentData);
export const processSignupPayment = (paymentData) => api.post('/signup-payment', paymentData);

export const submitFeedback = (feedbackData) => api.post('/feedback', feedbackData);

export const getTutorById = (id) => api.get(`/tutor/${id}`);
export const createSession = (data) => api.post('/sessions', data);
export const confirmSession = (sessionId) => api.post(`/sessions/${sessionId}/confirm`);
export const getTutorSessions = () => api.get('/tutor/sessions');

export const getSessionById = (id) => api.get(`/sessions/${id}`);

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/submit-review', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error.response?.data?.error || error.message || 'Failed to submit review';
  }
};

export const completeSession = async (sessionId) => {
  try {
    const response = await api.put(`/sessions/${sessionId}/complete`, {});
    return response.data;
  } catch (error) {
    console.error('Error completing session:', error);
    throw error.response?.data?.error || error.message || 'Failed to complete session';
  }
};

export const startCallSession = async (sessionId) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/start-call`, {});
    return response.data;
  } catch (error) {
    console.error('Error starting call session:', error);
    throw error.response?.data?.error || error.message || 'Failed to start call session';
  }
};

export const getFilterOptions = async () => {
  try {
    const response = await api.get('/filter-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error.response?.data?.error || error.message || 'Failed to fetch filter options';
  }
};

export default api;