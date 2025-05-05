import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import Navbar from './components/layout/NavBar';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FindTutorsPage from './pages/FindTutorPage';
import BecomeTutorPage from './pages/BecomeTutorPage';
import TutorProfilePage from './pages/tutors/TutorProfilePage';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import BookingPage from './pages/BookingPage';
import NotFoundPage from './pages/NotFoundPage';
import PaymentPage from './pages/SessionPaymentPage';
import Contact from './pages/Contact';
import ProfileRedirect from './pages/ProfileRedirect';
import EditTutorProfilePage from './pages/EditTutorProfile';
import EditStudentProfilePage from './pages/EditStudentProfilePage';
import SessionsRedirect from './pages/SessionRedirect';
import VideoCallPage from './pages/VideoCallPage';
import SessionConfirmationPage from './pages/SessionConfirmationPage';
import FAQPage from './pages/FAQPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PricingPage from './pages/PricingPage';
import DashboardRedirect from './pages/DashboardRedirect';
import { checkAuth } from './features/auth/authSlice';
import { useEffect, useState } from 'react';
import SignupPaymentPage from './pages/SignupPaymentPage';

const ProtectedRoute = ({ allowedRoles, reverse = false }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      dispatch(checkAuth());
    }
  }, [dispatch, user, loading]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // For reverse protection (login/signup pages)
  if (reverse && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // For normal protection
  if (!reverse) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/find-tutors" element={<FindTutorsPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/FAQ" element={<FAQPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              
              {/* Auth-protected routes (reverse) */}
              <Route element={<ProtectedRoute reverse />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signup-payment" element={<SignupPaymentPage />} />
              </Route>

              {/* Protected routes (require auth) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfileRedirect />} />
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route path="/sessions" element={<SessionsRedirect />} />
                <Route path="/book/:id" element={<BookingPage />} />
                <Route path="/tutors/:id" element={<TutorProfilePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/sessions/:id/video-call" element={<VideoCallPage />} />
                <Route path="/sessions/:id/confirm" element={<SessionConfirmationPage />} />
              </Route>

              {/* Tutor-specific routes */}
              <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
                <Route path="/become-tutor" element={<BecomeTutorPage />} />
                <Route path="/edit-tutor-profile" element={<EditTutorProfilePage />} />
              </Route>

              {/* Student-specific routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/edit-student-profile" element={<EditStudentProfilePage />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;