import React from 'react';
import { Link } from 'react-router-dom';
import { SlCalender } from "react-icons/sl";
import { LuHeartHandshake } from "react-icons/lu";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import Card from '../components/Card';

const Home = () => {
    return (
        <div className='flex flex-col'>
            {/* Header Section */}
            <div className='text-white py-20 text-center bg-blue-700 flex justify-center items-center flex-col'>
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>Effortless Event Scheduling</h1>
                <p className='text-lg md:text-xl'>Plan and schedule your events with ease.</p>
                <Link to='/'>
                    <button className='bg-white text-blue-700 px-4 py-2 mt-4 rounded-md'>Get Started</button>
                </Link>
            </div>

            {/* Key Features Section */}
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='py-10 text-center font-bold text-3xl text-black'>
                    <h1>Key Features</h1>
                    {/* Cards Section */}
                    <div className='flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0 items-center mt-8'>
                        <Card 
                            icon={<SlCalender className='text-yellow-600 bg-white'/>} 
                            heading="Smart Availability"
                            para='Automatically sync your calendars and set your availability preferences.'
                        />
                        <Card 
                            icon={<LuHeartHandshake className='text-green-600 bg-white'/>}
                            heading="Easy Event Creation"
                            para='Create events and invite participants with a few clicks.'
                        />
                        <Card
                            icon={<IoNotificationsCircleSharp className='text-red-600 bg-white'/>}
                            heading="Real-time Notifications"
                            para='Get notified when participants respond to your event invitations.'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
