import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice';
import { Input } from '../ui/Input';
import Button from '../ui/Button';

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'English', 'History'];
const SPECIALTIES = ['Speaking Practice', 'Exam Preparation', 'Writing Skills', 'Conversational Skills', 'Homework Help'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SignupForm = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    academicLevel: '',
    selectedSubjects: [],
    department: '',
    preferredLanguage: '',
    pricePerHour: '',
    yearsOfExperience: '',
    gender: '',
    educationLevel: '',
    levelToTeach: '',
    tutorSubjects: [],
    tutorPrice: '',
    specialties: [],
    bio: '',
    availability: {},
    photo: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      if (["tutorSubjects", "specialties", "selectedSubjects"].includes(name)) {
        setFormData((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter((v) => v !== value),
        }));
      } else if (name === 'availability') {
        setFormData((prev) => ({
          ...prev,
          availability: {
            ...prev.availability,
            [value]: prev.availability[value] ? undefined : { start: '', end: '' },
          },
        }));
      }
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTimeChange = (day, field, value) => {
    const timeString = value;
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const utcTimeString = `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`;

    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: utcTimeString,
          [`${field}Local`]: timeString,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      gender: formData.gender,
    };

    if (role === 'student') {
      userData.academicLevel = formData.academicLevel;
      userData.subjects = formData.selectedSubjects;
      userData.department = formData.department || undefined;
      userData.languages = formData.preferredLanguage ? [formData.preferredLanguage] : undefined;
      userData.pricePerHour = formData.pricePerHour ? Number(formData.pricePerHour) : undefined;
    } else if (role === 'tutor') {
      userData.yearsOfExperience = formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined;
      userData.academicLevel = formData.educationLevel || undefined;
      userData.subjects = formData.tutorSubjects;
      userData.specialties = formData.specialties;
      userData.bio = formData.bio || undefined;
      userData.pricePerHour = formData.tutorPrice ? Number(formData.tutorPrice) : undefined;
      userData.availability = Object.entries(formData.availability).map(([day, times]) => ({
        day,
        startTime: times.start,
        endTime: times.end,
      })).filter(slot => slot.startTime && slot.endTime);
      userData.avatarUrl = formData.photo ? URL.createObjectURL(formData.photo) : undefined;
    }

    try {
      const response = await dispatch(registerUser(userData)).unwrap();
      if (response.paymentRequired) {
        navigate('/signup-payment', { state: { userData: response.userData } });
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error registering:', err);
      alert(err.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-secondary-900">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-secondary-600">
          Please choose your role to get started
        </p>
      </div>

      <div className="flex justify-center gap-6 border-b border-gray-300 pb-4">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`px-4 py-2 font-medium ${
            role === 'student'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole('tutor')}
          className={`px-4 py-2 font-medium ${
            role === 'tutor'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-teal-600'
          }`}
        >
          Tutor
        </button>
      </div>

      {role && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="focus:ring-teal-500"/>
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="focus:ring-teal-500"/>
          <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="focus:ring-teal-500"/>
          <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="focus:ring-teal-500"/>
          <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {role === 'student' && (
            <>
              <select name="academicLevel" value={formData.academicLevel} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Select Academic Level</option>
                <option value="primary">Primary School</option>
                <option value="highschool">High School</option>
                <option value="university">University</option>
              </select>

              {(formData.academicLevel === 'primary' || formData.academicLevel === 'highschool') && (
                <div>
                  <label className="block font-medium mb-1">Subjects</label>
                  <div className="flex flex-wrap gap-3">
                    {SUBJECTS.map((subject) => (
                      <label key={subject} className="text-sm">
                        <input type="checkbox" name="selectedSubjects" value={subject} onChange={handleChange} className="mr-1" />
                        {subject}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.academicLevel === 'university' && (
                <select name="department" value={formData.department} onChange={handleChange} required className="w-full p-2 border rounded">
                  <option value="">Select Department</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="business">Business</option>
                  <option value="law">Law</option>
                </select>
              )}

              <Input name="preferredLanguage" placeholder="Preferred Language" value={formData.preferredLanguage} onChange={handleChange} className="focus:ring-teal-500"/>
              <Input name="pricePerHour" placeholder="Price Willing to Pay per Hour" value={formData.pricePerHour} onChange={handleChange} className="focus:ring-teal-500"/>
            </>
          )}

          {role === 'tutor' && (
            <>
              <Input name="yearsOfExperience" placeholder="Years of Experience" value={formData.yearsOfExperience} onChange={handleChange} required className="focus:ring-teal-500"/>
              <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Highest Education Level Completed</option>
                <option value="highschool">High School Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
              <select name="levelToTeach" value={formData.levelToTeach} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Education Level You Want to Teach</option>
                <option value="primary">Primary School</option>
                <option value="highschool">High School</option>
                <option value="university">University</option>
              </select>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Photo</label>
                <input type="file" name="photo" accept="image/*" onChange={handleChange} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Subjects You Can Teach</label>
                <div className="flex flex-wrap gap-3">
                  {SUBJECTS.map((subject) => (
                    <label key={subject} className="text-sm">
                      <input type="checkbox" name="tutorSubjects" value={subject} onChange={handleChange} className="mr-1" />
                      {subject}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Specialties</label>
                <div className="flex flex-wrap gap-3">
                  {SPECIALTIES.map(goal => (
                    <label key={goal} className="text-sm">
                      <input type="checkbox" name="specialties" value={goal} onChange={handleChange} className="mr-1" />
                      {goal}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Availability</label>
                <div className="space-y-2">
                  {DAYS.map(day => (
                    <div key={day} className="flex items-center gap-2">
                      <input type="checkbox" name="availability" value={day} onChange={handleChange} checked={!!formData.availability[day]} />
                      <span className="text-sm">{day}</span>
                      <input type="time" value={formData.availability[day]?.start || ''} onChange={(e) => handleTimeChange(day, 'start', e.target.value)} className="border rounded px-2 py-1 text-sm" disabled={!formData.availability[day]} />
                      <span className="text-sm">to</span>
                      <input type="time" value={formData.availability[day]?.end || ''} onChange={(e) => handleTimeChange(day, 'end', e.target.value)} className="border rounded px-2 py-1 text-sm" disabled={!formData.availability[day]} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Bio (Optional)</label>
                <textarea name="bio" rows={4} placeholder="Tell students about your teaching style and experience..." className="w-full p-2 rounded text-sm focus:outline-teal-500 border border-gray-500/20" value={formData.bio} onChange={handleChange} />
              </div>
              <Input name="tutorPrice" placeholder="Price per Hour (ETB)" value={formData.tutorPrice} onChange={handleChange} required className="focus:ring-teal-500"/>
            </>
          )}

          <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <span className="text-secondary-600">Already have an account?</span>{' '}
        <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700">
          Sign in
        </Link>
      </div>
    </div>
  );
};