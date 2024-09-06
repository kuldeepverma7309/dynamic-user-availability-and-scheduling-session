import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authUser } from '../features/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);
            console.log(response.data);
            dispatch(authUser(response.data));
            navigate('/');
            toast.success('Logged in Successfully');
        } catch (error) {
            console.log(error);
            toast.error('Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-screen bg-blue-500 flex justify-center items-center'>
            <form onSubmit={handleLogin} className='shadow-lg rounded-lg w-96 bg-blue-600 h-auto pt-5 pb-6 flex flex-col justify-center items-center mb-3 hover:shadow-2xl hover:transition-all'>
                <div className='flex flex-col space-y-2 justify-center items-center'>
                    <h1 className='text-2xl text-white text-center py-4 '>Login Yourself</h1>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='py-2 px-4 rounded-md w-72 bg-slate-700 text-white'
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='py-2 px-4 rounded-md w-72 bg-slate-700 text-white'
                    />
                </div>
                <button type='submit' className='text-xl py-3 px-4 bg-green-700 text-white rounded-xl mb-3 hover:scale-110 transition-all w-72 mx-auto mt-3'>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <Link to="/signup">
                    <span className='text-sm text-white hover:underline hover:text-base transition-all ease-out duration-300 hover:text-green-900 hover:font-bold'>
                        You don't have an Account? Signup
                    </span>
                </Link>
            </form>
        </div>
    );
};

export default Login;