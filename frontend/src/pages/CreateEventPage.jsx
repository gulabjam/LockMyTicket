import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateEventForm from '../components/CreateEventForm';
import { useNavigate } from 'react-router-dom';

const CreateEventPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start pt-24 pb-12">
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-3xl font-bold mb-4">Create Event</h1>
          <CreateEventForm onSuccess={(event) => {
            // navigate to organizer events or show a toast
            navigate('/my-events');
          }} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateEventPage;
