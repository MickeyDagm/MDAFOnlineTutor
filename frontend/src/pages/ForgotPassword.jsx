import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendPasswordResetEmail } from '../features/auth/authSlice';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await dispatch(sendPasswordResetEmail({ email })).unwrap();
      setSuccess('A password reset link has been sent to your email. Please check your inbox.');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <p className="text-center text-gray-600">
          Enter your email address, and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">{success}</div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{' '}
          <a href="/login" className="text-teal-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;