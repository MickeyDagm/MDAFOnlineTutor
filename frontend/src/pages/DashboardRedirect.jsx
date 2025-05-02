import StudentDashboardPage from './dashboard/StudentDashboard';
import TutorDashboardPage from './dashboard/TutorDashBoardPage';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!user) {
        navigate('/login');
      } else if (user.role === 'tutor') {
        // No navigation needed, render TutorMyProfilePage
      } else if (user.role === 'student') {
        // No navigation needed, render StudentMyProfilePage
      } else {
        navigate('/');
      }
    }, [user, navigate]);
  
    if (!user) return null;
  
    return user.role === 'tutor' ? <TutorDashboardPage /> : user.role === 'student' ? <StudentDashboardPage /> : null;
  };

  export default DashboardRedirect;