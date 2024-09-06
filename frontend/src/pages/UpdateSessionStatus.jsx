import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useSocket } from '../utils/SocketProvider';

const SessionTable = () => {
  const [sessions, setSessions] = useState([]);
  const token = useSelector(state => state.auth.token);
  const socket = useSocket();

  useEffect(() => {
    // Fetch incompleted sessions
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/session/incompleted', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSessions(response.data);
      } catch (error) {
        toast.error('Failed to fetch sessions');
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, [token]);

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.put(`http://localhost:5000/api/session/status/${sessionId}`, { status: newStatus }, config);
      let newSessions = sessions.filter(session => session._id !== sessionId);
      setSessions(newSessions);
    } catch (error) {
      toast.error('Failed to update session status');
      console.error('Error updating session status:', error);
    }
  };

  useEffect(() => {
    if (socket) {
      // Handle real-time updates
      socket.on('session_update', (updatedSession) => {
        toast.success('Session status updated');
      });

      // Cleanup on component unmount
      return () => {
        socket.off('session_update');
      };
    }
  }, [socket]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Update Session Status</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Start</th>
            <th className="py-2 px-4 border-b">End</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions?.map(session => (
            <tr key={session._id}>
              <td className="py-2 px-4 border-b">{session.title}</td>
              <td className="py-2 px-4 border-b">{new Date(session.start).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(session.end).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{session.status}</td>
              <td className="py-2 px-4 border-b">
                {session.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(session._id, 'completed')}
                      className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(session._id, 'canceled')}
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;