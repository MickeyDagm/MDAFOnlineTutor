import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
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
import PaymentPage from './pages/PaymentPage';
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
import TermsAndConditions from './pages/Footer/TermsAndConditions';
import PrivacyPolicy from './pages/Footer/PrivacyPolicy';
import CookiePolicy from './pages/Footer/CookiePolicy';


function App() {

  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/find-tutors" element={<FindTutorsPage />} />
              <Route path="/become-tutor" element={<BecomeTutorPage />} />
              <Route path="/tutors/:id" element={<TutorProfilePage />} />
              <Route path="/profile" element={<ProfileRedirect />} />
              <Route path="/EditTutorProfile" element={<EditTutorProfilePage />} />
              <Route path="/EditStudentProfile" element={<EditStudentProfilePage />} />
              <Route path="/edit-tutor-profile" element={<EditTutorProfilePage />} />
              <Route path="/edit-student-profile" element={<EditStudentProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/sessions/:id/video-call" element={<VideoCallPage />} />
              <Route path="/sessions/:id/confirm" element={<SessionConfirmationPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sessions" element={<SessionsRedirect />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/FAQ" element={<FAQPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy/>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;