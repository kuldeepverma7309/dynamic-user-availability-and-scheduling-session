import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setAvailability } from '../features/slices/AvailabilitySlice';
import { format, addMinutes } from 'date-fns'; // Only use `date-fns`

// Helper function to convert ISO datetime to 'HH:MM' in IST format
const formatTimeForInput = (isoString) => {
  const date = new Date(isoString);
  const istDate = addMinutes(date, 330); // Convert UTC to IST (IST = UTC + 5:30)
  return format(istDate, 'HH:mm'); // Format as 'HH:MM'
};

// Helper function to update the time in ISO format based on IST
const updateISOTime = (dateString, time) => {
  const [hours, minutes] = time.split(':');
  const date = new Date(dateString);
  const istDate = new Date(date.setHours(hours, minutes));
  const utcDate = addMinutes(istDate, -330); // Convert IST back to UTC
  return utcDate.toISOString();
};

const EditAvailability = () => {
  const { id } = useParams(); // Get availability ID from URL
  const token = useSelector((state) => state.auth.token);
  const availabilities = useSelector((state) => state.availability.availabilities);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [availability, setAvailabilityData] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    // Find the availability with the given ID
    const selectedAvailability = availabilities.find((a) => a._id === id);
    if (selectedAvailability) {
      setAvailabilityData(selectedAvailability);
      setSlots(selectedAvailability.slots);
    }
  }, [id, availabilities]);

  const handleSlotChange = (index, key, value) => {
    // Create a new array with cloned slot objects
    const updatedSlots = slots.map((slot, i) =>
      i === index ? { ...slot, [key]: key === 'start' || key === 'end' ? updateISOTime(slot[key], value) : value } : slot
    );
  
    // Update the state with the new array of slots
    setSlots(updatedSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading('Updating availability...');

    try {
      const res = await axios.post(
        `http://localhost:5000/api/availability`,
        { slots },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201) {
        toast.dismiss(toastId);
        toast.success('Availability updated successfully');

        // Update the Redux store with the new data
        const updatedAvailability = {
          ...availability,
          slots,
        };
        dispatch(
          setAvailability(
            availabilities.map((a) => (a._id === id ? updatedAvailability : a))
          )
        );

        navigate('/availability');
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error('Error updating availability');
    }
  };

  if (!availability) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Availability</h2>

      <form onSubmit={handleSubmit}>
        {slots.map((slot, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2 text-gray-700">Slot {index + 1}</label>
            <input
              type="text"
              value={slot.day}
              onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
              placeholder="Day"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="time"
              value={formatTimeForInput(slot.start)} // Show time in HH:MM format (IST)
              onChange={(e) => handleSlotChange(index, 'start', e.target.value)}
              placeholder="Start Time"
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
            <input
              type="time"
              value={formatTimeForInput(slot.end)} // Show time in HH:MM format (IST)
              onChange={(e) => handleSlotChange(index, 'end', e.target.value)}
              placeholder="End Time"
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
            <input
              type="number"
              value={slot.duration}
              onChange={(e) => handleSlotChange(index, 'duration', e.target.value)}
              placeholder="Duration (minutes)"
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
        ))}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAvailability;
