import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { getStudentSessions } from '../api/api';

const StudentSessionsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentSessions();
        setSessions(response.data || []);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError(err.response?.data?.error || 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'student') {
      fetchSessions();
    }
  }, [user]);

  if (!user || user.role !== 'student') {
    return (
      <div className="p-6 text-center text-gray-700">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>Please log in as a student to view your sessions.</p>
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
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Sessions</h1>
      {sessions.length === 0 ? (
        <p className="text-gray-600">No sessions scheduled yet.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session._id} className="p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-black">{session.subject}</h2>
                  <p className="text-gray-600">Tutor: {session.tutorId?.name || 'Unknown Tutor'}</p>
                  <p className="text-gray-600">Date: {new Date(session.startTime).toLocaleDateString()}</p>
                  <p className="text-gray-600">Time: {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}</p>
                  <p className="text-gray-600">Status: {session.status}</p>
                </div>
                {session.status === 'scheduled' && (
                  <Link to={`/sessions/${session._id}/confirm`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Confirm Session
                    </button>
                  </Link>
                )}
                {session.status === 'confirmed' && (
                  <Link to={`/sessions/${session._id}/video-call`}>
                    <button className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800">
                      Join Video Call
                    </button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSessionsPage;