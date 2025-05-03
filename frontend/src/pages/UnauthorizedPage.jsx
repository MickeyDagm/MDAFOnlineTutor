import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
      <p className="text-lg text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;