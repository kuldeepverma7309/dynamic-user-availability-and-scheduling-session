import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../utils/SocketProvider';

const AvailableUsersTable = () => {
  const { user } = useSelector((state) => state.auth); 
  const { availabilities } = useSelector((state) => state.admin);
  const token = useSelector((state) => state.auth.token);
  const socket = useSocket();
  
  const [users, setUsers] = useState([...availabilities]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sessionDetails, setSessionDetails] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    duration: 30,
    type: 'one-on-one' // Default to 'one-on-one'
  });

  const handleSelectUser = (user) => {
    if (sessionDetails.type === 'group') {
      setSelectedUsers(prevSelected => {
        if (prevSelected.some(u => u._id === user._id)) {
          return prevSelected.filter(u => u._id !== user._id);
        } else {
          return [...prevSelected, user];
        }
      });
    } else {
      setSelectedUsers([user]); // Single user for one-on-one
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionDetails({ ...sessionDetails, [name]: value });
  };

  const handleSubmit = async () => {
    try {
        const config = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
      await axios.post('http://localhost:5000/api/session', {
        ...sessionDetails,
        admin: user._id,
        attendees: sessionDetails.type === 'group' ? selectedUsers.map(u => ({ name: u?.user?.name, email: u?.user?.email })) : selectedUsers?.length ? [{ name: selectedUsers[0].user?.name, email: selectedUsers[0]?.user?.email }] : [],
      },config);
      toast.success('Session scheduled successfully');
      socket.emit('session_update', { status: 'scheduled', title: sessionDetails.title });
      setSessionDetails({
        title: '',
        description: '',
        start: '',
        end: '',
        duration: 30,
        type: 'one-on-one', // Reset to default
      });
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast.error('Error scheduling session');
    }
  };

  socket.on('session_update', (sessionData) => {
    toast.success("new session created");
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Users</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="w-full bg-gray-100 border-b border-gray-200">
            <th className="py-3 px-4 text-left">Select</th>
            <th className="py-3 px-4 text-left">User</th>
            <th className="py-3 px-4 text-left">Slots</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-200">
              <td className="py-2 px-4">
                <input
                  type={sessionDetails.type === 'group' ? 'checkbox' : 'radio'}
                  name="selectedUser"
                  checked={sessionDetails.type === 'group' ? selectedUsers.some(u => u._id === user._id) : selectedUsers.length === 1 && selectedUsers[0]._id === user._id}
                  onChange={() => handleSelectUser(user)}
                  disabled={sessionDetails.type === 'one-on-one' && selectedUsers.length === 1 && selectedUsers[0]._id !== user._id}
                />
              </td>
              <td className="py-2 px-4">{user?.user ? user?.user?.name : 'No User'}</td>
              <td className="py-2 px-4">
                {user?.slots?.length} Slots
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Schedule Session</h3>
        <form>
          <label className="block mb-2">
            Title:
            <input
              type="text"
              name="title"
              value={sessionDetails.title}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Description:
            <textarea
              name="description"
              value={sessionDetails.description}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Start Time:
            <input
              type="datetime-local"
              name="start"
              value={sessionDetails.start}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            End Time:
            <input
              type="datetime-local"
              name="end"
              value={sessionDetails.end}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Duration (minutes):
            <input
              type="number"
              name="duration"
              value={sessionDetails.duration}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </label>
          <label className="block mb-4">
            Session Type:
            <select
              name="type"
              value={sessionDetails.type}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="one-on-one">One-on-One</option>
              <option value="group">Group</option>
            </select>
          </label>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Schedule Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default AvailableUsersTable;
