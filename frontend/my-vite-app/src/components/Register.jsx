// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://app-gest-stock-api.vercel.app/api/auth/register', { username, password, email });
      toast.success('User registered successfully');
      navigate('/login');
    } catch (err) {
      console.error("Error during registration:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data.msg);
      } else {
        toast.error('An error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create New Account</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-primary text-white py-2 px-4 rounded">Create</button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

