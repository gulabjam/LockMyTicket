import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrganizerEventCard from '../components/OrganizerEventCard';
import { AuthContext } from '../context/AuthContext';

const MyEventsPage = () => {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
        if (!token) {
          setError('Missing authentication token');
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/organizer/get-events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events);
        } else {
          setError('Failed to load events');
        }
        setLoading(false);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const { id, event: updated } = e.detail || {};
      if (!id) return;
      setEvents((prev) => prev.map((it) => (it.id === id ? { ...it, ...updated } : it)));
    };
    window.addEventListener('event-updated', handler);
    return () => window.removeEventListener('event-updated', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <main className="flex-1 py-6 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-4">My Events</h1>

          {loading && <div className="text-gray-300">Loading events...</div>}
          {error && <div className="text-red-400">{error}</div>}

          {!loading && events.length === 0 && (
            <div className="text-gray-400">No events found.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {events.map((ev) => (
              <OrganizerEventCard key={ev.id} event={ev} onDeletion={(deletedId) => setEvents(events.filter((event) => event.id !== deletedId))} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyEventsPage;
