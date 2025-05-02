import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTutorById } from '../../api/api'; // Import the API function
import Button from '../../components/ui/Button.jsx';

const TutorProfilePage = () => {
  const { id } = useParams();
  console.log('id from URL:', id);
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTutorById(id);
        setTutor(response.data);
      } catch (err) {
        console.error('Error fetching tutor:', err);
        setError(err.response?.data?.error || 'Failed to load tutor');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-700">Loading...</div>;
  }

  if (error || !tutor) {
    return (
      <div className="p-6 text-center text-gray-700">
        <h1 className="text-2xl font-bold text-red-600">Tutor Not Found</h1>
        <p>{error || "We couldn't find the tutor you're looking for."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img
          src={tutor.avatarUrl || 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
          alt={tutor.name}
          className="w-40 h-40 object-cover rounded-full border"
        />
        <div>
          <h1 className="text-3xl font-bold text-black">{tutor.name}</h1>
          <p className="text-gray-600">{tutor.subjects?.join(', ') || 'N/A'}</p>
          <p className="text-yellow-600 mt-1">⭐ {tutor.rating || 0} rating</p>
          <p className="text-sm text-gray-500 mt-1">{tutor.totalStudents || 0} students · {tutor.totalSessions || 0} sessions</p>
          <p className="text-lg font-semibold text-green-600 mt-2">{tutor.pricePerHour || 0} ETB/hour</p>
          <Button 
            className="mt-4 bg-teal-700 hover:bg-teal-800" 
            size="lg"  
            as={Link}
            to={`/book/${tutor._id}`} // Use _id from MongoDB
          >
            Book a Session
          </Button>
        </div>
      </div>

      {/* Bio */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">About {tutor.name.split(' ')[0]}</h2>
        <p className="text-gray-700">{tutor.bio || 'No bio available.'}</p>
      </div>

      {/* Specialties */}
      {tutor.specialties && tutor.specialties.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.specialties.map((item, i) => (
              <span key={i} className="bg-teal-200/80 text-green-900 px-3 py-1 text-sm rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {tutor.availability && tutor.availability.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Availability</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tutor.availability.map((slot, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded border text-gray-700">
                {slot.day}: {slot.startTime} - {slot.endTime}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorProfilePage;