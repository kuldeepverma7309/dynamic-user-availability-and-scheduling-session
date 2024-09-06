import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditSession = () => {
  const { id } = useParams(); // Get session ID from URL
  const token = useSelector(state => state.auth.token);
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    start: '',
    duration: '',
    type: '',
  });
  const navigate = useNavigate();

   // Function to format date as "yyyy-MM-ddThh:mm" for datetime-local input
   const formatDateForInput = (isoDate) => {
    const date = new Date(isoDate);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    // Fetch the session data by ID when component mounts
    const fetchSessionData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(`http://localhost:5000/api/session/get/${id}`, config);
        const session = res.data;
        // Format the start date properly before setting it in state
        setSessionData({
          ...session,
          start: formatDateForInput(session.start), // Format date for datetime-local input
        });
      } catch (error) {
        toast.error('Error fetching session data');
        console.error('Error:', error);
      }
    };
    fetchSessionData();
  }, [id, token]);

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    let toastId = toast.loading('Updating session');
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(`http://localhost:5000/api/session/edit/${id}`, sessionData, config);
      if (res.status === 200) {
        toast.dismiss(toastId);
        toast.success('Session updated successfully');
        navigate('/sessions'); // Redirect to sessions list page
      } else {
        toast.error('Failed to update session');
        toast.dismiss(toastId);
      }
    } catch (error) {
        toast.dismiss(toastId);
      toast.error('Error updating session');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Session</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={sessionData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={sessionData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date and Time</label>
          <input
            type="datetime-local"
            name="start"
            value={sessionData.start}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Duration (in minutes)</label>
          <input
            type="number"
            name="duration"
            value={sessionData.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <input
            type="text"
            name="type"
            value={sessionData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-500 text-white p-2 rounded-md">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditSession;
