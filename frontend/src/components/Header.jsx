import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authUser } from '../features/slices/authSlice';

const Header = () => {
    const user = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);
    const location = useLocation();
    const path = location.pathname;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = async() => {
        let toastId = toast.loading('Logging out...');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/logout');
        if(res.status === 200){
            toast.dismiss(toastId);
            toast.success('Logged out successfully');
            dispatch(authUser(res.data));
            navigate('/login');
        }
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId);
            toast.error('Error logging out');
        }
    }
  return (
    <header className='w-full flex justify-center items-center bg-blue-600'>
        <div className='flex w-[1280px] mx-auto md:justify-between shadow-lg md:items-center p-4 bg-blue-600 text-white justify-center sm:items-center'>
            <h1 className='text-xl font-bold w-fit hidden md:flex'>Dynamic Event Scheduling System</h1>
            <nav>
            <ul className='flex font-medium space-x-3'>
                <Link to='/' className={`px-3 hover:bg-red-600 rounded-lg py-2 bg-blue-800 hover:transition-all hover:font-bold ${path === "/" ? "bg-green-500" : ""}`}><li>Home</li></Link>
                {
                    token ? (
                        <>
                            <Link to='/sessions' className={`px-3 hover:bg-red-600 rounded-lg py-2 bg-blue-800 hover:transition-all hover:font-bold ${path === "/sessions" ? "bg-green-500" : ""}`}><li>Sessions</li></Link>
                            <button onClick={logoutHandler} className={`px-3 hover:bg-red-600 rounded-lg py-2 bg-blue-800 hover:transition-all hover:font-bold ${path === "/logout" ? "bg-green-500" : ""}`}><li>Logout</li></button>
                            <Link to='/availability' className={`px-3 hover:bg-red-600 rounded-lg py-2 bg-blue-800 hover:transition-all hover:font-bold ${path === "/availability" ? "bg-green-500" : ""}`}><li>Availability</li></Link>
                            {
                                user?.role === 'admin' && (
                                    <Link to='/dashboard' className={`px-3 hover:bg-red-600 rounded-lg py-2 bg-blue-800 hover:transition-all hover:font-bold ${path === "/dashboard" ? "bg-green-500" : ""}`}><li>Dashboard</li></Link>
                                )
                            }
                        </>
                    ) : (
                        <>
                            <Link to='/login' className={`px-3 hover:bg-red-600 rounded-lg py-2 bg-blue-800 hover:transition-all hover:font-bold ${path === "/login" ? "bg-green-500" : ""}`}><li>Login</li></Link>
                            <Link to='/signup' className={`px-3 hover:bg-red-600 rounded-lg py-2 bg-blue-800 hover:transition-all hover:font-bold ${path === "/signup" ? "bg-green-500" : ""}`}><li>Signup</li></Link>
                        </>
                    )
                }
            </ul>
            </nav>
        </div>
    </header>
  )
}

export default Header