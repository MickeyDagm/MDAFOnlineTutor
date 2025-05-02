import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {Card }from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getTutorEarnings, getTutorReviews } from '../api/api'; // Import API functions

const TutorMyProfilePage = () => {
  const { user } = useSelector((state) => state.auth); // Get authenticated user from Redux
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch earnings to calculate total sessions and students
        const earningsResponse = await getTutorEarnings();
        const sessions = earningsResponse.data;

        // Fetch reviews to calculate average rating
        const reviewsResponse = await getTutorReviews();
        const reviews = reviewsResponse.data;

        // Calculate stats
        const totalSessions = sessions.length;
        const totalStudents = new Set(sessions.map((session) => session.student)).size;
        const averageRating =
          reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : 0;

        setStats({
          totalStudents,
          totalSessions,
          rating: averageRating,
        });
      } catch (err) {
        console.error('Error fetching tutor stats:', err);
        setError(err.response?.data?.error || 'Failed to load profile stats');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'tutor') {
      fetchTutorStats();
    }
  }, [user]);

  if (!user || user.role !== 'tutor') {
    return (
      <div className="p-6 text-center text-gray-700">
        <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
        <p>Please make sure you’re logged in as a tutor.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-gray-700">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
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
          <p className="text-gray-700 mt-1">Subjects: {user.subjects?.join(', ') || 'N/A'}</p>
          <p className="text-green-700 font-semibold mt-1">ETB {user.pricePerHour || 0}/hour</p>
          <p className="text-yellow-600 mt-1">⭐ {stats.rating} average rating</p>
          <Link to="/edit-tutor-profile">
            <Button className="mt-4 bg-teal-700 hover:bg-teal-800">Edit Profile</Button>
          </Link>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-2">About Me</h2>
        <p className="text-gray-700">{user.bio || 'No bio available.'}</p>
      </Card>

      {/* Specialties */}
      {user.specialties && user.specialties.length > 0 && (
        <Card className="p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-black mb-2">Teaching Specialties</h2>
          <div className="flex flex-wrap gap-3">
            {user.specialties.map((goal, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full">
                {goal}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Availability */}
      {user.availability && user.availability.length > 0 && (
        <Card className="p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-black mb-2">Availability</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.availability.map((slot, i) => (
              <div key={i} className="text-gray-700">
                {slot.day}: {slot.startTime} - {slot.endTime}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Stats Summary */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-4">My Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-black">{stats.totalStudents}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-black">{stats.totalSessions}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-500">{stats.rating}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TutorMyProfilePage;