import React, { useEffect, useState } from 'react';
import { randomAvatar } from '../utils/randomAvatar';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getSessions } from '../features/slices/sessionSlice';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({ session }) => {
  const { admin, title, description, duration, start, type, _id, attendees } = session;
  const sessions = useSelector(state => state.session.sessions);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    let toastId;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      toastId = toast.loading('Deleting session');
      const res = await axios.delete(`http://localhost:5000/api/session/${id}`, config);
      toast.dismiss(toastId);
      if (res.status === 200) {
        toast.success('Session deleted successfully');
        let newSessions = sessions.filter(session => session._id !== id);
        dispatch(getSessions(newSessions));
      } else {
        toast.error('Error deleting session');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'Error deleting session');
    }
  };

  const handleEdit = async (id) => {
    navigate(`/session/${id}`)
  };

  // Format date and time
  const startDate = new Date(start);
  const formattedDate = startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const url = await randomAvatar(admin.name.split(" ")[0], admin.name.split(" ")[1]);
        setAvatar(url);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvatar();
  }, [admin.name]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl w-full hover:shadow-2xl hover:transition-all hover:shadow-black relative items-center flex justify-start">
      <div className="md:flex">
        <div className="">
          <div className="absolute top-[10px] right-[10px] flex gap-3">
            <button onClick={() => handleEdit(_id)} aria-label="Edit session">
              <CiEdit className='text-2xl hover:bg-red-600 rounded-lg hover:text-white' />
            </button>
            <button onClick={() => handleDelete(_id)} aria-label="Delete session">
              <MdDelete className='text-2xl hover:bg-red-600 rounded-lg hover:text-white' />
            </button>
          </div>
        </div>
        <div className="p-8 w-full">
          {/* Title */}
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-bold">{type} Session</div>
          <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{title}</h2>

          {/* Description */}
          <p className="mt-2 text-gray-500">{description}</p>

          {/* Session Date, Time, and Duration */}
          <div className="mt-4">
            <div className="text-gray-700 text-sm font-semibold">Date & Time:</div>
            <p className="text-gray-800">{formattedDate} at {formattedTime}</p>
          </div>
          <div className="mt-2">
            <div className="text-gray-700 text-sm font-semibold">Duration:</div>
            <p className="text-gray-800">{duration} minutes</p>
          </div>

          {/* Admin Info */}
          <div className="mt-4 flex items-center">
            <img className="h-10 w-10 rounded-full" src={avatar} alt="admin avatar" />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-800">{admin.name}</div>
              <div className="text-sm text-gray-500">{admin.email}</div>
            </div>
          </div>

          {/* Attendees Count */}
          <div className="mt-4 flex space-x-2">
            <div className="text-gray-700 text-sm font-semibold">Attendees:</div>
            <p className="text-gray-800 text-sm">{attendees.length} People</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;