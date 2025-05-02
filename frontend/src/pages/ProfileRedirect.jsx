import StudentMyProfilePage from './StudentMyProfilePage';
import TutorMyProfilePage from './TutorMyProfilePage';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfileRedirect = () => {
    const { user } = useSelector((state) => state.auth);
    console.log('User in ProfileRedirect:', user);
    const { role } = user || {};
    console.log('Role in ProfileRedirect:', role);
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
  
    return user.role === 'tutor' ? <TutorMyProfilePage /> : user.role === 'student' ? <StudentMyProfilePage /> : null;
  };

  export default ProfileRedirect;