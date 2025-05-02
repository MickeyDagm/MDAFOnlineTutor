import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getTutorById, createSession, getTutorSessions } from '../api/api';

const BookingPage = () => {
  const [tutor, setTutor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tutor details
        const tutorResponse = await getTutorById(id);
        console.log('Fetched tutor:', tutorResponse.data);
        const fetchedTutor = tutorResponse.data;
        setTutor(fetchedTutor);

        // Set default subject
        if (fetchedTutor.subjects && fetchedTutor.subjects.length > 0) {
          setSelectedSubject(fetchedTutor.subjects[0]);
        }

        // Compute available slots
        const slots = [];
        const today = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Generate slots for the next 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dayName = daysOfWeek[date.getDay()];
          const dateStr = date.toISOString().split('T')[0]; // e.g., "2025-05-01"

          // Find the tutor's availability for this day
          const dayAvailability = fetchedTutor.availability?.find(slot => slot.day === dayName);
          if (!dayAvailability) continue;
          
          const startHour = parseInt(dayAvailability.startTime?.split(':')[0], 10);
          const endHour = parseInt(dayAvailability.endTime?.split(':')[0], 10);
          
          if (isNaN(startHour) || isNaN(endHour)) continue;
          
          for (let h = startHour; h < endHour; h++) {
            const time = `${String(h).padStart(2, '0')}:00`;
            const localDateTime = new Date(`${dateStr}T${time}:00`);
            const utcDateTime = new Date(localDateTime.getTime() - (localDateTime.getTimezoneOffset() * 60000));
            slots.push({
              date: dateStr,
              day: dayName,
              time,
              utcTime: utcDateTime.toISOString().split('T')[1].substring(0, 5), // UTC time
              utcDate: utcDateTime.toISOString().split('T')[0] // UTC date
            });
          }
        }

        // Fetch booked sessions for the tutor
        const sessionsResponse = await getTutorSessions(id);
        const bookedSessions = sessionsResponse.data;

        // Filter out slots that are already booked
        const available = slots.filter(slot => {
          const slotStart = new Date(`${slot.date}T${slot.time}:00`);
          const slotEnd = new Date(slotStart.getTime() + 4 * 60 * 60 * 1000); // Max 4-hour duration
          return !bookedSessions.some(session => {
            const sessionStart = new Date(`${session.date}T${session.startTime}:00`);
            const sessionEnd = new Date(`${session.date}T${session.endTime}:00`);
            return sessionStart < slotEnd && sessionEnd > slotStart;
          });
        });

        setAvailableSlots(available);
      } catch (err) {
        console.error('Error fetching tutor:', err);
        setError(err.response?.data?.error || 'Failed to load tutor');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSlot || !selectedSubject) {
      alert('Please select a subject, time slot, and duration.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create the session
      const response = await createSession({
        tutorId: id,
        selectedTime: `${selectedSlot.day} ${selectedSlot.time}`,
        selectedDuration,
        subject: selectedSubject,
        selectedDate: selectedSlot.date,
        utcStartTime: `${selectedSlot.utcDate}T${selectedSlot.utcTime}:00`, // Send UTC time
        timezoneOffset: new Date().getTimezoneOffset() // Send client's timezone offset
      });

      const session = response.data.session;

      // Navigate to payment page with session details
      navigate('/payment', {
        state: {
          sessionId: session._id,
          tutor,
          selectedTime: `${selectedSlot.day} ${selectedSlot.time}`,
          selectedDuration,
          subject: selectedSubject,
          total: tutor.pricePerHour * selectedDuration,
        },
      });
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.response?.data?.error || 'Failed to book session');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">Book a Session with {tutor.name}</h1>

      {/* Tutor Card */}
      <Card className="flex items-center space-x-4 p-5 mb-6 shadow-md rounded-xl">
        <img
          src={tutor.avatarUrl || 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
          alt={tutor.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{tutor.name}</h2>
          <p className="text-sm text-gray-600 mb-1">Subjects: {tutor.subjects?.join(', ') || 'N/A'}</p>
          <p className="text-sm text-gray-600 mb-1">Languages: {tutor.languages?.join(', ') || 'N/A'}</p>
          <p className="text-sm text-gray-600 mb-1">Experience: {tutor.yearsOfExperience || 0} years</p>
          <p className="text-sm text-gray-800 font-medium">Rate: {tutor.pricePerHour ? `${tutor.pricePerHour} ETB/hr` : 'N/A'}</p>
        </div>
      </Card>

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a subject --</option>
            {tutor.subjects?.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Available Time Slot</label>
          <select
            value={selectedSlot ? `${selectedSlot.date} ${selectedSlot.day} ${selectedSlot.time}` : ''}
            onChange={(e) => {
              const [date, day, time] = e.target.value.split(' ');
              setSelectedSlot({ date, day, time });
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a slot --</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={`${slot.date} ${slot.day} ${slot.time}`}>
                {`${slot.day}, ${slot.date} at ${slot.time}`}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Duration (hours)</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4].map(hour => (
              <option key={hour} value={hour}>
                {hour} hour{hour > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <Button
          type="button"
          onClick={handleBooking}
          disabled={loading}
          className="w-full text-white font-semibold bg-teal-700 hover:bg-teal-800 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </div>
    </div>
  );
};

export default BookingPage;