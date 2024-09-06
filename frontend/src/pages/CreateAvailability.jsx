import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setAvailability } from '../features/slices/AvailabilitySlice';

// Helper function to convert time to ISO format
const convertToISO = (day, time) => {
  if (!time || !time.includes(':')) {
    return null;  // Handle invalid time format
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    return null;  // Handle invalid time values
  }

  const current = new Date();
  const currentDayOfWeek = current.getDay();
  const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);

  // Calculate the date for the next occurrence of the given day
  const diff = (dayIndex - currentDayOfWeek + 7) % 7;
  current.setDate(current.getDate() + diff);

  // Set the time in the Date object
  current.setHours(hours, minutes, 0, 0);

  return current.toISOString();
};

const CreateAvailability = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [slots, setSlots] = useState([
    { day: 'Monday', start: '', end: '', duration: 30 },
  ]);

  const handleSlotChange = (index, key, value) => {
    const updatedSlots = slots.map((slot, i) =>
      i === index ? { ...slot, [key]: value } : slot
    );
    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { day: 'Monday', start: '', end: '', duration: 30 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading('Creating availability...');

    try {
      const formattedSlots = slots.map((slot) => ({
        ...slot,
        start: convertToISO(slot.day, slot.start),
        end: convertToISO(slot.day, slot.end),
      }));

      // Check if any slot conversion failed
      if (formattedSlots.some((slot) => !slot.start || !slot.end)) {
        toast.dismiss(toastId);
        toast.error('Invalid time or day selected');
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/availability`,
        { slots: formattedSlots },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201) {
        toast.dismiss(toastId);
        toast.success('Availability created successfully');

        dispatch(setAvailability(res.data));
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Error creating availability');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Availability</h2>

      <form onSubmit={handleSubmit}>
        {slots.map((slot, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2 text-gray-700">Slot {index + 1}</label>
            <select
              value={slot.day}
              onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={slot.start}
              onChange={(e) => handleSlotChange(index, 'start', e.target.value)}
              placeholder="Start Time"
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
            <input
              type="time"
              value={slot.end}
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

        <button
          type="button"
          onClick={addSlot}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Add Slot
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 ml-2"
        >
          Create Availability
        </button>
      </form>
    </div>
  );
};

export default CreateAvailability;
