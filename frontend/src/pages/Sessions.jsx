import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SessionCard from '../components/SessionCard';
import { useDispatch, useSelector } from 'react-redux';
import { getSessions } from '../features/slices/sessionSlice';
import toast from 'react-hot-toast';

const Sessions = () => {
  const email = useSelector((state) => state.auth.user.email);
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.session.sessions);
  const [loading, setLoading] = useState(false);
 

  useEffect(() => {
    // Fetch sessions from the backend API
    const fetchSessions = async () => {
      setLoading(true);
        const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          email: email,
        },
      };
      try {
        console.log("email", email);
        const response = await axios.get(`http://localhost:5000/api/session/user/${email}`, config); 
        dispatch(getSessions(response.data));
        toast.success('Sessions fetched successfully');
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [dispatch, email]);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h2 className="text-xl font-bold text-white bg-blue-600 w-fit px-4 text-center py-2 rounded-2xl hover:scale-95 hover:transition-all cursor-pointer mb-6 mx-auto">Your Sessions</h2>

      {/* Display sessions in a grid format */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {sessions.map((session) => (
          <SessionCard key={session._id} session={session} />
        ))}
      </div>
    </div>
  );
};

export default Sessions;