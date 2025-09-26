import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SignUpForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try{
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message || 'Sign up successful!');
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          navigate('/signIn');
        } else {
          alert(data.error || 'Sign up failed. Please try again.');
        }

      }catch(err){
        console.error('Error during sign up:', err);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-md shadow-md w-full mt-12 relative z-10">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-gray-300 mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
