import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { setAvailability } from '../features/slices/AvailabilitySlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const randomAvatar = async (firstName, lastName) => {
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${firstName}${lastName}`;
};

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};



const AvailabilityCard = ({ availability }) => {
  const { user, slots, _id } = availability;
  const [avatar, setAvatar] = useState('');
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const availabilities = useSelector(state => state.availability.availabilities);
  const navigate = useNavigate();

  const handleDelete = async(id) => {
    const toastId = toast.loading('Deleting availability');
    try {
      const res = await axios.delete(`http://localhost:5000/api/availability/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.status === 200){
        toast.dismiss(toastId);
        toast.success('Availability deleted successfully');
        dispatch(setAvailability(availabilities.filter(availability => availability._id !== id)));
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'Error deleting availability');
    }
  };
  
  const handleEdit = (id) => {
    navigate(`/edit-availability/${id}`);
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    acc[slot.day] = acc[slot.day] || [];
    acc[slot.day].push(slot);
    return acc;
  }, {});

  useEffect(() => {
    const fetchAvatar = async () => {
      const url = await randomAvatar(user.name.split(' ')[0], user.name.split(' ')[1]);
      setAvatar(url);
    };
    fetchAvatar();
  }, [user?.name]);

  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-2xl hover:transition-all max-w-full w-full lg:w-[800px] p-6 flex flex-col lg:flex-row justify-center items-center lg:items-stretch space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Edit & Delete Buttons */}
      <div className="absolute top-4 right-4 flex gap-3">
        <button onClick={()=>handleEdit(_id)} aria-label="Edit session">
          <CiEdit className="text-2xl hover:bg-red-600 rounded-lg hover:text-white" />
        </button>
        <button onClick={()=>handleDelete(_id)} aria-label="Delete session">
          <MdDelete className="text-2xl hover:bg-red-600 rounded-lg hover:text-white" />
        </button>
      </div>

      {/* User Information */}
      <div className="flex flex-col items-center lg:items-start space-y-4 lg:w-1/3">
        <img className="h-24 w-24 rounded-full" src={avatar} alt="User avatar" />
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Calendar with Slots */}
      <div className="w-full lg:w-2/3 bg-gray-100 p-4 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Available Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(groupedSlots).map((day, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="font-bold mb-2">{day.slice(0, 3)}</div>
              {groupedSlots[day].map((slot, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  {formatTime(slot?.start)} - {formatTime(slot.end)} ({slot?.duration} min)
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCard;
