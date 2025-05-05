import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    const result = await dispatch(loginUser({ email: normalizedEmail, password: trimmedPassword }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-secondary-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-secondary-600">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error === 'User not found' ? 'No account found with this email.' :
             error === 'Incorrect password' ? 'The password you entered is incorrect.' :
             error}
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          leftIcon={<Mail className="h-4 w-4" />}
          className="focus:ring-teal-500"
        />

        <Input
          label="Password"
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          className="focus:ring-teal-500"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-teal-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgotPassword" className="font-medium text-teal-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          leftIcon={!loading && <LogIn className="h-4 w-4" />}
          className="bg-teal-700 hover:bg-teal-800 "
        >
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-secondary-600">Don't have an account?</span>{' '}
        <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-700">
          Sign up now
        </Link>
      </div>
    </div>
  );
};