import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAvailability } from '../features/slices/AvailabilitySlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import AvailabilityCard from '../components/AvailabilityCard';
import { Link } from 'react-router-dom';

const Availability = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const availabilities = useSelector(state => state.availability.availabilities);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      let toastId = toast.loading('Fetching Availability');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      try {
        const res = await axios.get('http://localhost:5000/api/availability/getAllAvailabilities', config);
        console.log("res.data.availabilities: ", res.data);
        dispatch(setAvailability(res.data));
        toast.success('Availability fetched successfully');

      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'Error fetching availability');
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [dispatch, token]);

  return (
    <div className="container p-6 min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold text-white bg-blue-600 w-fit px-4 py-2 rounded-2xl hover:scale-95 hover:transition-all cursor-pointer mb-6 text-center mx-auto">Your Availabilities</h2>

      {/* Display sessions in a grid format */}
      <div className="flex flex-col justify-center items-center">
        {
          availabilities.length > 0 ? availabilities.map((availability, i) => (
            <AvailabilityCard availability={availability} key={i} />
          )) : <div className="text-center text-gray-500">No availabilities found
          <Link to="/create-availability" className="text-blue-500 hover:underline"> Create Availability</Link>
          </div>
        }
      </div>
    </div>
  );
};

export default Availability;
