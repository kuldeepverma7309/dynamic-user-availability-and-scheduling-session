import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getData } from '../features/slices/adminSlice';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth); 
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { totalSessions, availableSlots, notifications, recentSessions, availabilities } = useSelector((state) => state.admin);

  useEffect(() => {
    // fetch admin data
    const fetchData = async () => {
      let toastId = toast.loading('Loading...');
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
        const res = await axios.get('http://localhost:5000/api/availability/get-adminData', config);
        if (res.status === 200) {
          toast.dismiss(toastId);
          toast.success('Data fetched successfully');
          dispatch(getData(res.data));
        }
        console.log(res.data);
      } catch (error) {
        toast.dismiss(toastId);
        toast.error('Failed to fetch data');
        console.error(error);
      }
    }
    fetchData();
  }, [dispatch, token]);

  return (
    <div className="container mx-auto p-6">
      {/* Dashboard Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || 'User'}!</h1>
        <p className="text-gray-600">Here’s an overview of your activity.</p>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Sessions</h2>
          <p className="text-3xl font-bold text-blue-500">{totalSessions}</p>
          <Link
            to="/sessions"
            className="mt-4 inline-block text-blue-500 hover:underline text-sm"
          >
            View all sessions →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Slots</h2>
          <p className="text-3xl font-bold text-green-500">{availableSlots}</p>
          <Link
            to="/availability"
            className="mt-4 inline-block text-green-500 hover:underline text-sm"
          >
            Manage availability →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
          <p className="text-3xl font-bold text-yellow-500">{notifications?.length}</p>
          <Link
            to="/notifications"
            className="mt-4 inline-block text-yellow-500 hover:underline text-sm"
          >
            View notifications →
          </Link>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {recentSessions.slice(0, 3).map((session) => (
              <li key={session._id} className="py-4">
                <p className="text-gray-800">
                  {session.title} scheduled for{' '}
                  <span className="font-semibold">
                    {new Date(session.start).toLocaleString()}
                  </span>.
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(parseISO(session.start))} ago
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* User Actions */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <Link
              to="/schedule-new-session"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg inline-block hover:bg-blue-600"
            >
              Schedule a New Session
            </Link>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <Link
              to="/update-session-status"
              className="bg-green-500 text-white py-2 px-4 rounded-lg inline-block hover:bg-green-600"
            >
              Update Session Status
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;