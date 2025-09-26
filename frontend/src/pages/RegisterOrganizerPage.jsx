import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterOrganizerForm from '../components/RegisterOrganizerForm';

const RegisterOrganizerPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <RegisterOrganizerForm />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterOrganizerPage;
