import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Calendar, 
  Award, 
  Star, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Target 
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { TutorCard } from '../components/tutors/TutorCard';
import { searchTutors } from '../api/api'; // Import the API function
import sidePic from "../assets/sidepic.png";
import Rahel from "../assets/Rahel.jpg";
import Fatuma from "../assets/Fatuma.jpg";
import Henok from "../assets/Henok.jpg";
const HomePage = () => {
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(filteredTutors);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTutors: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({});

  const fetchTutors = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

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
      setFilteredTutors(response.data.tutors);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalTutors: response.data.totalTutors,
        limit: response.data.limit,
      });
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setError(err.response?.data?.error || 'Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tutors on initial load and when filters or page change
  useEffect(() => {
    fetchTutors(1); // Initial fetch
  }, [filters]);

  // Subjects with icons
  const subjectAreas = [
    { name: 'Mathematics', icon: <Target className="h-10 w-10 text-teal-700" /> },
    { name: 'Science', icon: <Sparkles className="h-10 w-10 text-teal-700" /> },
    { name: 'Languages', icon: <BookOpen className="h-10 w-10 text-teal-700" /> },
    { name: 'Test Prep', icon: <Award className="h-10 w-10 text-teal-700" /> },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="">
        <div className="container mx-auto px-4 py-20 sm:py-12 lg:py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6 animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Find the perfect tutor for your learning journey
              </h1>
              <p className="text-lg text-teal-800 sm:text-xl max-w-xl">
                Connect with expert tutors who can help you excel in your studies, from high school to university level and beyond.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link to="/find-tutors">
                  <Button size="lg" leftIcon={<Search className="h-5 w-5" />} className="border-black text-white bg-teal-700 hover:bg-teal-800">
                    Find a Tutor
                  </Button>
                </Link>
                <Link to="/become-tutor">
                  <Button size="lg" variant="outline" className="border-black text-black hover:bg-white/10">
                    Become a Tutor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img
                src={sidePic}
                alt="Online tutoring session"
                className="rounded-lg object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 bg-teal-700/90 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-white">5,000+</p>
              <p className="text-secondary-300 mt-1">Qualified Tutors</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-white">50,000+</p>
              <p className="text-secondary-300 mt-1">Students Taught</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-white">200,000+</p>
              <p className="text-secondary-300 mt-1">Sessions Completed</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-white">4.8</p>
              <p className="text-secondary-300 mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-secondary-900">How MDAF Works</h2>
            <p className="mt-3 text-lg text-secondary-600 max-w-xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-8">
            <Card className="text-center p-6 border-0 shadow-md animate-slide-up" hoverable>
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <Search className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-secondary-900">Find a Tutor</h3>
              <p className="mt-2 text-secondary-600">
                Browse profiles, read reviews, and find the perfect tutor for your subject and budget.
              </p>
            </Card>
            
            <Card className="text-center p-6 border-0 shadow-md animate-slide-up" style={{ animationDelay: '100ms' }} hoverable>
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <Calendar className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-secondary-900">Book a Session</h3>
              <p className="mt-2 text-secondary-600">
                Schedule a time that works for you and make secure payments through our platform.
              </p>
            </Card>
            
            <Card className="text-center p-6 border-0 shadow-md animate-slide-up" style={{ animationDelay: '200ms' }} hoverable>
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <Users className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-secondary-900">Start Learning</h3>
              <p className="mt-2 text-secondary-600">
                Connect with your tutor via video conference and begin your personalized learning journey.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Featured Tutors */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900">Featured Tutors</h2>
              <p className="mt-2 text-lg text-secondary-600">
                Meet some of our top-rated tutors
              </p>
            </div>
            <Link to="/find-tutors" className="mt-4 md:mt-0 inline-flex items-center text-teal-700 hover:text-teal-800">
              View all tutors
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-center text-gray-600">Loading tutors...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : filteredTutors.length > 0 ? (
              filteredTutors.map((tutor, index) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))
            ) : (
              <p className="text-center text-gray-600">No tutors found.</p>
            )}
          </div>
        </div>
      </section>
      
      {/* Subject Areas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900">Explore by Subject</h2>
            <p className="mt-3 text-lg text-secondary-600 max-w-xl mx-auto">
              Find expert tutors in a wide range of academic subjects
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {subjectAreas.map((subject, index) => (
              <Link key={index} to="/find-tutors" className="group">
                <Card className="text-center p-6 transition-all duration-300 group-hover:border-primary-300 group-hover:bg-primary-50/50" hoverable>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center">
                    {subject.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-secondary-900 group-hover:text-primary-700">
                    {subject.name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link to="/find-tutors">
              <Button size="lg" variant="outline">
                Browse All Subjects
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Success Stories</h2>
            <p className="mt-3 text-lg text-secondary-300 max-w-xl mx-auto">
              See what our students and tutors have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="bg-secondary-800 border-0 shadow-lg text-white">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="mb-6 text-secondary-300">
                "The science sessions were a game changer for me. My tutor broke down complex topics into simple concepts, and I finally started enjoying learning again!"
              </p>
              <div className="flex items-center">
                <img
                  src={Rahel}
                  alt="Student"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-medium text-white">Rahel Tesfaye</p>
                  <p className="text-secondary-300">Grade 9 Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary-800 border-0 shadow-lg text-white">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="mb-6 text-secondary-300">
                  "I was struggling with English grammar, but my tutor’s patient guidance helped me score top marks in my national exam. I’m now more confident in class!"
                </p>
                <div className="flex items-center">
                  <img
                    src={Fatuma}
                    alt="Student"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-white">Fatuma Mohammed</p>
                    <p className="text-secondary-300">Grade 10 Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary-800 border-0 shadow-lg text-white">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="mb-6 text-secondary-300">
                  "Joining this tutoring platform helped me prepare for my university entrance exam. The lessons were personalized and super effective!"
                </p>
                <div className="flex items-center">
                  <img
                    src={Henok}
                    alt="Student"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-white">Henok Alemu</p>
                    <p className="text-secondary-300">Prospective University Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;