import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Dynamic User Availability and Event Scheduling System</h2>
            <p className="text-sm">© 2024 All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="/" className="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="/" className="text-gray-400 hover:text-white">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;