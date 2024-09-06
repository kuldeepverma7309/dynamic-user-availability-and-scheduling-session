import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        <a href="/" className="text-indigo-500 hover:text-indigo-700 text-lg">
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;