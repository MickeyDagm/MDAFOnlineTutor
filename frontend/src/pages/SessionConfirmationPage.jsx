import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { confirmSession } from '../api/api';
import { useNavigate } from 'react-router-dom';

const SessionConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleConfirm = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Confirming session with ID:', id); // Debug log
        const response = await confirmSession(id);
        console.log('Confirmation response:', response.data); // Debug log
        setMessage('Session confirmed successfully!');
        setTimeout(() => navigate('/sessions'), 2000); // Redirect after 2 seconds
      } catch (err) {
        console.error('Error confirming session:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.error || 'Failed to confirm session');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      handleConfirm();
    }
  }, [id, navigate]);

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-800">Confirm Session</h1>
      {loading && <p>Confirming...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
};

export default SessionConfirmationPage;