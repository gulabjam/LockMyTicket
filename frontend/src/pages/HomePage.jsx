import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user]);

  return (
    <div className="bg-gray-900 text-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
