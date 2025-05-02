import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { updateProfile } from '../api/api'; // Import the API function

const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Biology', 'Chemistry', 'Business', 'History'];
const SPECIALTIES = ['Speaking Practice', 'Exam Preparation', 'Writing Skills', 'Conversational Skills', 'Homework Help'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditTutorProfilePage = () => {
  const { user } = useSelector((state) => state.auth); // Get authenticated user from Redux
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    yearsOfExperience: 0,
    subjects: [],
    specialties: [],
    pricePerHour: 0,
    bio: '',
    availability: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'tutor') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || '',
        yearsOfExperience: user.yearsOfExperience || 0,
        subjects: user.subjects || [],
        specialties: user.specialties || [],
        pricePerHour: user.pricePerHour || 0,
        bio: user.bio || '',
        availability: user.availability || [],
      });
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== 'tutor') {
    return (
      <div className="p-6 text-center text-gray-700">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>Please log in as a tutor to edit your profile.</p>
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

  const toggleArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const toggleDay = (day) => {
    const exists = formData.availability.some(a => a.day === day);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        availability: prev.availability.filter(a => a.day !== day),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, { day, startTime: '09:00', endTime: '17:00' }],
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (day, field, value) => {
    const newAvailability = formData.availability.map(a =>
      a.day === day ? { ...a, [field]: value } : a
    );
    setFormData(prev => ({ ...prev, availability: newAvailability }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await updateProfile(formData);
      console.log('Profile updated:', response.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="p-6 space-y-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-black">Edit My Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Full Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} className="focus:ring-teal-500"/>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <Input name="email" value={formData.email} onChange={handleChange} className="focus:ring-teal-500"/>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Gender</label>
            <Input name="gender" value={formData.gender} onChange={handleChange} className="focus:ring-teal-500"/>
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Years of Experience</label>
            <Input name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} className="focus:ring-teal-500"/>
          </div>

          {/* Price Per Hour */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Price per Hour (ETB)</label>
            <Input name="pricePerHour" type="number" value={formData.pricePerHour} onChange={handleChange} className="focus:ring-teal-500"/>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Subjects</label>
            <div className="flex flex-wrap gap-3">
              {SUBJECTS.map(sub => (
                <label key={sub} className="text-sm">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={formData.subjects.includes(sub)}
                    onChange={() => toggleArray('subjects', sub)}
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Specialties</label>
            <div className="flex flex-wrap gap-3">
              {SPECIALTIES.map(goal => (
                <label key={goal} className="text-sm">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={formData.specialties.includes(goal)}
                    onChange={() => toggleArray('specialties', goal)}
                  />
                  {goal}
                </label>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Bio</label>
            <textarea
              name="bio"
              rows={4}
              className="w-full border p-2 rounded text-sm"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Availability</label>
            <div className="space-y-4">
              {DAYS.map(day => {
                const slot = formData.availability.find(a => a.day === day);
                const isActive = !!slot;

                return (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 border p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleDay(day)}
                      />
                      <span className="text-sm font-medium text-gray-800">{day}</span>
                    </div>

                    {isActive && (
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600">From</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          className="border px-2 py-1 rounded text-sm"
                        />

                        <label className="text-sm text-gray-600">To</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          className="border px-2 py-1 rounded text-sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="mt-6 bg-teal-700 hover:bg-teal-800">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};

export default EditTutorProfilePage;