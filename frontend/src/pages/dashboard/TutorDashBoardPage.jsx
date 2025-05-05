import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { getTutorSessions, getTutorEarnings, getTutorReviews } from '../../api/api';

export default function TutorDashboardPage() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({ sessions: true, earnings: true, reviews: true });
  const [error, setError] = useState({ sessions: null, earnings: null, reviews: null });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch upcoming sessions
      try {
        setLoading((prev) => ({ ...prev, sessions: true }));
        setError((prev) => ({ ...prev, sessions: null }));

        if (!user || !user._id) {
          throw new Error('User not authenticated');
        }

        console.log('Fetching sessions for tutor ID:', user._id); // Debug log
        const sessionsResponse = await getTutorSessions();
        console.log('Raw tutor sessions data:', sessionsResponse.data);

        const tutorSessions = sessionsResponse.data
          .filter(session => {
            const sessionDate = new Date(session.startTime);
            const isFuture = sessionDate > new Date();
            console.log('Session startTime:', session.startTime, 'Parsed Date:', sessionDate, 'Is Future:', isFuture); // Debug log
            return isFuture;
          })
          .map(session => ({
            subject: session.subject,
            studentName: session.studentId?.name || 'Unknown Student',
            date: session.date,
            time: session.startTime,
          }));
        console.log('Filtered tutor sessions:', tutorSessions);
        setUpcomingSessions(tutorSessions);
      } catch (err) {
        console.error('Error fetching sessions:', err.response ? err.response.data : err.message);
        setError((prev) => ({ ...prev, sessions: err.response?.data?.error || err.message || 'Failed to load sessions' }));
      } finally {
        setLoading((prev) => ({ ...prev, sessions: false }));
      }

      // Fetch earnings
      try {
        setLoading((prev) => ({ ...prev, earnings: true }));
        setError((prev) => ({ ...prev, earnings: null }));

        const earningsResponse = await getTutorEarnings();
        console.log('Raw earnings data:', earningsResponse.data);
        setEarnings(earningsResponse.data || []);
      } catch (err) {
        console.error('Error fetching earnings:', {
          message: err.response?.data?.error || err.message,
          details: err.response?.data?.details || 'No details available',
        });
        setError((prev) => ({ ...prev, earnings: err.response?.data?.error || 'Failed to load earnings' }));
      } finally {
        setLoading((prev) => ({ ...prev, earnings: false }));
      }

      // Fetch reviews
      try {
        setLoading((prev) => ({ ...prev, reviews: true }));
        setError((prev) => ({ ...prev, reviews: null }));

        const reviewsResponse = await getTutorReviews();
        console.log('Raw reviews data:', reviewsResponse.data);
        setReviews(reviewsResponse.data || []);
      } catch (err) {
        console.error('Error fetching reviews:', err.response ? err.response.data : err.message);
        setError((prev) => ({ ...prev, reviews: err.response?.data?.error || 'Failed to load reviews' }));
      } finally {
        setLoading((prev) => ({ ...prev, reviews: false }));
      }
    };

    if (user && user.role === 'tutor') {
      fetchData();
    } else {
      console.warn('User is not a tutor or not authenticated:', user);
      setError((prev) => ({ ...prev, sessions: 'User is not a tutor or not authenticated' }));
      setLoading((prev) => ({ ...prev, sessions: false, earnings: false, reviews: false }));
    }
  }, [user]);

  const isLoading = loading.sessions || loading.earnings || loading.reviews;
  const hasError = error.sessions || error.earnings || error.reviews;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-black">
        Welcome Back, {user?.name || 'Tutor'}!
      </h1>

      {hasError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          Failed to load dashboard data: {error.sessions || error.earnings || error.reviews}
        </div>
      )}

      <section>
        <h2 className="text-xl font-medium text-black mb-3">Upcoming Sessions</h2>
        {loading.sessions ? (
          <div className="text-gray-500">Loading sessions...</div>
        ) : error.sessions ? (
          <div className="text-red-500">{error.sessions}</div>
        ) : upcomingSessions.length === 0 ? (
          <div className="text-gray-500">No upcoming sessions.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session, index) => (
              <Card key={index} className="p-4 border border-gray-200">
                <h3 className="text-lg font-semibold">{session.subject}</h3>
                <p className="text-sm text-gray-600">Student: {session.studentName}</p>
                <p className="text-sm text-gray-600">Date: {session.date}</p>
                <p className="text-sm text-gray-600">Time: {session.time}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium text-black mb-3">Earnings Summary</h2>
        {loading.earnings ? (
          <div className="text-gray-500">Loading earnings...</div>
        ) : error.earnings ? (
          <div className="text-red-500">{error.earnings.message} - Details: {error.earnings.details}</div>
        ) : earnings.length === 0 ? (
          <div className="text-gray-500">No earnings data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 border-b">Student</th>
                  <th className="p-3 border-b">Subject</th>
                  <th className="p-3 border-b">Total (ETB)</th>
                  <th className="p-3 border-b">Commission (30%)</th>
                  <th className="p-3 border-b">Net (ETB)</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((entry, index) => (
                  <tr key={index}>
                    <td className="p-3 border-b">{entry.student}</td>
                    <td className="p-3 border-b">{entry.subject}</td>
                    <td className="p-3 border-b">{entry.total.toFixed(2)}</td>
                    <td className="p-3 border-b text-red-500">{entry.commission.toFixed(2)}</td>
                    <td className="p-3 border-b text-green-600">{entry.net.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium text-black mb-3">Student Reviews</h2>
        {loading.reviews ? (
          <div className="text-gray-500">Loading reviews...</div>
        ) : error.reviews ? (
          <div className="text-red-500">{error.reviews}</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500">No reviews yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review, index) => (
              <Card key={index} className="p-4 border border-gray-200">
                <p className="font-semibold">{review.student}</p>
                <p className="text-sm italic text-gray-700">"{review.comment}"</p>
                <p className="text-yellow-500 mt-1">Rating: {'⭐'.repeat(review.rating)}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}