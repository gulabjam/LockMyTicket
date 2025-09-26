import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const OrganizerDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizerDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/organizer/get-details`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (res.ok && data.organizer) {
          setOrganizer(data.organizer);
        } else {
          setError(data.error || 'Could not fetch organizer details.');
        }
      } catch (err) {
        setError('Error fetching organizer details.');
      }
      setLoading(false);
    };
    fetchOrganizerDetails();
  }, [token]);

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-400 font-bold">{error}</div>;
  if (!organizer || !organizer.isVerified) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Access Denied</h2>
            <p>Your organizer account is not verified yet. Please contact support or wait for verification.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome, {organizer.orgName}!</h2>
          <p className="text-lg text-gray-300 mb-4">Your organizer dashboard is ready.</p>
          <p className="text-orange-400 font-semibold">You can now create and manage your events.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrganizerDashboard;
