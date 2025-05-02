import React from 'react';
import { Link } from 'react-router-dom';
import  Button  from '../components/ui/Button';
import { Search, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-16rem)] items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-teal-600">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-teal-900">Page not found</h2>
        <p className="mt-2 text-secondary-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Link to="/" >
            <Button leftIcon={<Home className="h-4 w-4" />} className="bg-teal-600 hover:bg-teal-700">
              Back to Home
            </Button>
          </Link>
          <Link to="/find-tutors">
            <Button variant="outline" leftIcon={<Search className="h-4 w-4" />}>
              Find Tutors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
