import React, { useState, useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RegisterOrganizerForm = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [form, setForm] = useState({
    orgName: '',
    contact_no: '',
    address: '',
    description: '',
  });
  const [kycFile, setKycFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setKycFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kycFile) {
      setMessage('Please upload your KYC document.');
      return;
    }
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('orgName', form.orgName);
    formData.append('contact_no', form.contact_no);
    formData.append('address', form.address);
    formData.append('description', form.description);
    formData.append('id', user?.user_id);
    formData.append('Kycdoc', kycFile);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/organizer/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Organizer registration successful!');
        setForm({ orgName: '', contact_no: '', address: '', description: '' });
        setKycFile(null);
        fileInputRef.current.value = '';
        logout();
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto mt-12 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Register as Organizer</h2>
      <div className="mb-4">
        <label className="block mb-2 text-gray-300">Organization Name</label>
        <input type="text" name="orgName" value={form.orgName} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter organization name" />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-300">Contact Number</label>
        <input type="text" name="contact_no" value={form.contact_no} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter contact number" />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-300">Address</label>
        <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter address" />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-300">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Describe your organization" rows={3} />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-gray-300">KYC Document</label>
        <input type="file" name="Kycdoc" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} ref={fileInputRef} required className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>
      {message && <div className={`mb-4 text-center ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>}
      <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300">
        {loading ? 'Registering...' : 'Register as Organizer'}
      </button>
    </form>
  );
};

export default RegisterOrganizerForm;
