import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateEventForm from '../components/CreateEventForm';
import { AuthContext } from '../context/AuthContext';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      try {
        
      } catch (err) {
        console.error(err);
        setError('Failed to load event');
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id, token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start pt-24 pb-12">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-3xl font-bold mb-4">Edit Event</h1>
          {loading && <div className="text-gray-300">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          {!loading && !eventData && <div className="text-gray-400">Event not found</div>}
          {eventData && (
            <CreateEventForm onSuccess={(ev) => { navigate('/my-events'); }} initialData={eventData} isEdit />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditEventPage;
