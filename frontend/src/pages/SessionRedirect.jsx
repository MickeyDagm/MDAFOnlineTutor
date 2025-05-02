import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StudentSessionsPage from './StudentSessionPage';
import TutorSessionsPage from './TutorSessionPage';

const SessionsRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  console.log('User in SessionsRedirect:', user);
  const { role } = user || {};
  console.log('Role in SessionsRedirect:', role);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'student' && user.role !== 'tutor') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return user.role === 'student' ? <StudentSessionsPage /> : user.role === 'tutor' ? <TutorSessionsPage /> : null;
};

export default SessionsRedirect;