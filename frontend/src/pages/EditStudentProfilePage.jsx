import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { updateProfile } from '../api/api';

const SUBJECTS = ['Mathematics', 'English', 'Physics', 'Biology', 'Chemistry', 'Business', 'History'];

const EditStudentProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    enrolledSubjects: [],
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'student') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || '',
        enrolledSubjects: user.enrolledSubjects || [],
        bio: user.bio || '',
      });
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== 'student') {
    return (
      <div className="p-6 text-center text-gray-700">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>Please log in as a student to edit your profile.</p>
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

          {/* Enrolled Subjects */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Enrolled Subjects</label>
            <div className="flex flex-wrap gap-3">
              {SUBJECTS.map(sub => (
                <label key={sub} className="text-sm">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={formData.enrolledSubjects.includes(sub)}
                    onChange={() => toggleArray('enrolledSubjects', sub)}
                  />
                  {sub}
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

          {/* Submit */}
          <Button type="submit" className="mt-6 bg-teal-700 hover-bg-teal-800">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};

export default EditStudentProfilePage;