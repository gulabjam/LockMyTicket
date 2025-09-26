import React from 'react';
import SignInForm from '../components/SignInForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignInPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col overflow-y-auto relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
          alt="Party crowd" 
          className="w-full h-full object-cover opacity-20" />
      </div>
      <Header />
      <main className="flex-grow flex items-center justify-center relative z-10">
        <SignInForm />
      </main>
      <Footer />
    </div>
  );
};

export default SignInPage;
