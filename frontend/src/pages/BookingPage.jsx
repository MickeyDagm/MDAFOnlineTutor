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
        console.log('Fetched tutor:', JSON.stringify(tutorResponse.data, null, 2));
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
          const dateStr = date.toISOString().split('T')[0]; // e.g., "2025-05-15"

          // Find the tutor's availability for this day
          const dayAvailability = fetchedTutor.availability?.find(slot => slot.day === dayName);
          if (!dayAvailability) continue;

          const startHour = parseInt(dayAvailability.startTime?.split(':')[0], 10);
          const startMinute = parseInt(dayAvailability.startTime?.split(':')[1] || '0', 10);
          const endHour = parseInt(dayAvailability.endTime?.split(':')[0], 10);
          const endMinute = parseInt(dayAvailability.endTime?.split(':')[1] || '0', 10);

          if (isNaN(startHour) || isNaN(endHour)) continue;

          // Generate slots in 30-minute increments
          let currentTime = startHour * 60 + startMinute;
          const endTime = endHour * 60 + endMinute;

          while (currentTime < endTime) {
            const hours = Math.floor(currentTime / 60);
            const minutes = currentTime % 60;
            const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            const localDateTime = new Date(`${dateStr}T${time}:00+03:00`); // Assume tutor's time in EAT (UTC+3)
            const utcDateTime = new Date(localDateTime.getTime() - (3 * 60 * 60 * 1000)); // Convert to UTC
            const localDisplayTime = localDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Client's local time

            slots.push({
              date: dateStr,
              day: dayName,
              time: localDisplayTime, // Display in client's local time
              utcTime: utcDateTime.toISOString().split('T')[1].substring(0, 5), // UTC time (e.g., "06:00")
              utcDate: utcDateTime.toISOString().split('T')[0], // UTC date
              localDateTime: localDateTime.toISOString(), // For reference
            });

            currentTime += 30; // Increment by 30 minutes
          }
        }

        console.log('Generated slots:', JSON.stringify(slots, null, 2));

        // Fetch booked sessions for the tutor
        const sessionsResponse = await getTutorSessions(id);
        const bookedSessions = sessionsResponse.data;
        console.log('Booked sessions:', JSON.stringify(bookedSessions, null, 2));

        // Filter out slots that are already booked
        const available = slots.filter(slot => {
          const slotStart = new Date(slot.localDateTime);
          const slotEnd = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000); // Max 2-hour duration
          return !bookedSessions.some(session => {
            const sessionStart = new Date(`${session.date}T${session.startTime}:00Z`);
            const sessionEnd = new Date(`${session.date}T${session.endTime}:00Z`);
            return sessionStart < slotEnd && sessionEnd > slotStart;
          });
        });

        console.log('Available slots:', JSON.stringify(available, null, 2));
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
        utcStartTime: `${selectedSlot.utcDate}T${selectedSlot.utcTime}:00Z`, // UTC time
        timezoneOffset: new Date().getTimezoneOffset(), // Client's timezone offset
      });

      console.log('Session created:', JSON.stringify(response.data, null, 2));

      const session = response.data.session;

      // Navigate to payment page
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Available Time Slot (Tutor's timezone: EAT, UTC+3)
          </label>
          <select
            value={selectedSlot ? `${selectedSlot.date} ${selectedSlot.day} ${selectedSlot.time}` : ''}
            onChange={(e) => {
              const [date, day, time] = e.target.value.split(' ');
              const slot = availableSlots.find(s => s.date === date && s.day === day && s.time === time);
              setSelectedSlot(slot);
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a slot --</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={`${slot.date} ${slot.day} ${slot.time}`}>
                {`${slot.day}, ${slot.date} at ${slot.time} (Your local time)`}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Duration</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(parseFloat(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[
              { value: 0.5, label: '30 minutes' },
              { value: 1, label: '1 hour' },
              { value: 1.5, label: '1.5 hours' },
              { value: 2, label: '2 hours' },
            ].map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
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