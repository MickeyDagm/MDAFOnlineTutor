import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStudentSessions, searchTutors } from '../../api/api'; // Changed to getStudentSessions
import { Card } from '../../components/ui/Card';
import { TutorCard } from '../../components/tutors/TutorCard';

const ProgressChart = ({ title }) => (
  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded">
    <span className="text-gray-500">{title} Chart (Coming Soon)</span>
  </div>
);

export default function StudentDashboardPage() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState({ sessions: true, tutors: true });
  const [error, setError] = useState({ sessions: null, tutors: null });
  const { user } = useSelector((state) => state.auth);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTutors: 0,
    limit: 10,
  });

  useEffect(() => {
    fetchTutors(1);
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading((prev) => ({ ...prev, sessions: true }));
      setError((prev) => ({ ...prev, sessions: null }));

      const sessionsResponse = await getStudentSessions(); // Use getStudentSessions instead of getSessions
      console.log('Raw student sessions data:', sessionsResponse.data); // Debug log

      const sessions = sessionsResponse.data
        .filter(session => {
          const sessionDate = new Date(session.startTime);
          const isFuture = sessionDate > new Date();
          console.log('Session startTime:', session.startTime, 'Parsed Date:', sessionDate, 'Is Future:', isFuture); // Debug log
          return isFuture;
        })
        .map(session => ({
          subject: session.subject,
          tutor: session.tutorId?.name || 'Unknown Tutor',
          date: session.date,
          time: session.startTime,
        }));
      console.log('Filtered upcoming sessions:', sessions); // Debug log
      setUpcomingSessions(sessions);
    } catch (err) {
      console.error('Error fetching sessions:', err.response ? err.response.data : err.message);
      setError((prev) => ({ ...prev, sessions: err.response?.data?.error || 'Failed to load sessions' }));
    } finally {
      setLoading((prev) => ({ ...prev, sessions: false }));
    }
  };

  const fetchTutors = async (page = 1) => {
    try {
      setLoading((prev) => ({ ...prev, tutors: true }));
      setError((prev) => ({ ...prev, tutors: null }));

      const queryParams = {
        search: filters.search || undefined,
        learningGoals: filters.learningGoals?.length > 0 ? filters.learningGoals.join(',') : undefined,
        subjects: filters.subjects?.length > 0 ? filters.subjects.join(',') : undefined,
        priceMin: filters.priceRange ? filters.priceRange[0] : undefined,
        priceMax: filters.priceRange ? filters.priceRange[1] : undefined,
        availability: filters.availability?.length > 0 ? filters.availability.join(',') : undefined,
        rating: filters.rating || undefined,
        sortBy: filters.sortBy || undefined,
        page,
        limit: pagination.limit,
      };

      const response = await searchTutors(queryParams);
      setFilteredTutors(response.data.tutors || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalTutors: response.data.totalTutors,
        limit: response.data.limit,
      });
    } catch (err) {
      console.error('Error fetching tutors:', err.response ? err.response.data : err.message);
      setError((prev) => ({ ...prev, tutors: err.response?.data?.error || 'Failed to load tutors' }));
    } finally {
      setLoading((prev) => ({ ...prev, tutors: false }));
    }
  };

  const isLoading = loading.sessions || loading.tutors;
  const hasError = error.sessions && error.tutors; // Only show global error if both fail

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-black">
        Welcome Back, {user?.name || 'Student'}!
      </h1>

      {hasError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          Failed to load dashboard data
        </div>
      )}

      <section>
        <h2 className="text-xl font-medium text-black mb-3">Upcoming Sessions</h2>
        {loading.sessions ? (
          <div className="text-gray-500">Loading sessions...</div>
        ) : error.sessions && !upcomingSessions.length ? (
          <div className="text-gray-500">{error.sessions}</div>
        ) : upcomingSessions.length === 0 ? (
          <div className="text-gray-500">No upcoming sessions.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session, index) => (
              <Card key={index} className="p-4 border border-gray-200">
                <h3 className="text-lg font-semibold">{session.subject}</h3>
                <p className="text-sm text-gray-600">Tutor: {session.tutor}</p>
                <p className="text-sm text-gray-600">Date: {session.date}</p>
                <p className="text-sm text-gray-600">Time: {session.time}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium text-black mb-3">Recommended Tutors</h2>
        {loading.tutors ? (
          <div className="text-gray-500">Loading tutors...</div>
        ) : error.tutors && !filteredTutors.length ? (
          <div className="text-gray-500">{error.tutors}</div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-gray-500">No recommended tutors available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTutors.map((tutor, index) => (
              <TutorCard key={tutor.id || index} tutor={tutor} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium text-black mb-3">Progress Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProgressChart title="Attendance" />
          <ProgressChart title="Topic Mastery" />
        </div>
      </section>
    </div>
  );
}