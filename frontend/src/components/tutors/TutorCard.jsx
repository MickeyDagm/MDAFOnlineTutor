import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Calendar } from 'lucide-react';
import { formatCurrency } from '../../lib/util.jsx';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';

export const TutorCard = ({ tutor, featured = false }) => {
  console.log('TutorCard:', tutor); // Log the tutor object for debugging
  const {
    _id: id, // Use _id from MongoDB instead of id
    name,
    avatarUrl,
    subjects,
    pricePerHour,
    rating,
    totalSessions,
    yearsOfExperience,
  } = tutor;

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
        featured ? 'border-teal-100 bg-teal-100/40' : ''
      }`}
      hoverable
    >
      {featured && (
        <div className="bg-teal-500 text-white text-xs font-semibold py-1 px-3 text-center">
          Featured Tutor
        </div>
      )}
      
      <CardContent className="p-5">
        <div className="flex items-start space-x-4">
          <Link to={`/tutor/${id}`} className="flex-shrink-0">
            <img
              src={avatarUrl || 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
              alt={name}
              className="h-20 w-20 rounded-full object-cover border-2 border-teal-200"
            />
          </Link>
          
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <Link to={`/tutor/${id}`} className="text-lg font-semibold text-teal-900 hover:text-primary-600">
                {name}
              </Link>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm font-medium">{rating ? rating.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-secondary-600">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{subjects?.join(', ') || 'N/A'}</span>
            </div>
            
            <div className="flex items-center text-sm text-secondary-600">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{yearsOfExperience || 0} years experience</span>
            </div>
            
            <div className="flex items-center text-sm text-secondary-600">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{totalSessions || 0} sessions completed</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-secondary-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary-500">Hourly Rate</span>
            <div className="text-primary-700 font-bold">{formatCurrency(pricePerHour || 0)}</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              as={Link}
              to={`/tutors/${id}`}
            >
              View Profile
            </Button>
            <Button
              size="sm"
              as={Link}
              to={`/book/${id}`}
              className="bg-teal-700 text-white hover:bg-teal-800"
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};