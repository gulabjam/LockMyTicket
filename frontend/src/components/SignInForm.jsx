import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { user, login } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      navigate(`/dashboard?userId=${user.user_id}`);
    }
  },[]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try{
          const response = await fetch (`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)});
          const data = await response.json();
          
          if (response.ok) {
            login (data.user, data.token);
            setFormData({ email: '', password: '' });
            alert(data.message);
            navigate(`/dashboard`);
          }
          else {
            alert(data.error || 'Sign in failed. Please try again.');
          }

      }catch(err){
        console.error('Error during sign in:', err);
        alert('An error occurred during sign in. Please try again later.');
      }
  };
}

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            name = "email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-6">
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
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-300 text-sm">
          New user?{' '}
          <Link to="/signUp" className="text-orange-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
