import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getStudentSessions, getStudentReviews } from '../api/api';

const StudentMyProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sessions
        let totalSessions = 0;
        try {
          const sessionsResponse = await getStudentSessions();
          const sessions = sessionsResponse.data || [];
          totalSessions = sessions.length;
        } catch (err) {
          console.error('Error fetching student sessions:', err);
          setError(err.response?.data?.error || 'Failed to load session data');
        }

        // Fetch reviews
        let averageRating = 0;
        try {
          const reviewsResponse = await getStudentReviews();
          const reviews = reviewsResponse.data || [];
          averageRating =
            reviews.length > 0
              ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
              : 0;
        } catch (err) {
          console.error('Error fetching student reviews:', err);
          if (!error) {
            setError(err.response?.data?.error || 'Failed to load review data');
          }
        }

        setStats({
          totalSessions,
          averageRating,
        });
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'student') {
      fetchStudentStats();
    }
  }, [user]);

  if (!user || user.role !== 'student') {
    return (
      <div className="p-6 text-center text-gray-700">
        <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
        <p>Please make sure you’re logged in as a student.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-700">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header Section */}
      <Card className="p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200">
        <img
          src={user.avatarUrl || 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
          alt={user.name}
          className="w-32 h-32 rounded-full border object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-gray-700 mt-1">Enrolled Subjects: {user.enrolledSubjects?.join(', ') || 'N/A'}</p>
          <Link to="/edit-student-profile">
            <Button className="mt-4 bg-teal-700 hover:bg-teal-800">Edit Profile</Button>
          </Link>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-2">About Me</h2>
        <p className="text-gray-700">{user.bio || 'No bio available.'}</p>
      </Card>

      {/* Stats Summary */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-4">My Stats</h2>
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-black">{stats.totalSessions}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-500">{stats.averageRating}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentMyProfilePage;