import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import EventCard from './EventCard';
import OrganizerEventCard from './OrganizerEventCard';
import hookahImage from '../assets/hookah.png';
import beachImage from '../assets/beach.png';
import cafeImage from '../assets/cafe.png';
import concertImage from '../assets/concert.png';
import nightlifeImage from '../assets/nightlife.png';
import poolImage from '../assets/pool.png';
import turfImage from '../assets/turf.png';
import { use } from 'react';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [realEvents, setRealEvents] = useState([]);

  const events = [
    { id: 1, image: nightlifeImage, title: 'Nightlife', icon: true },
    { id: 2, image: cafeImage, title: 'Cafes', icon: true },
    { id: 3, image: beachImage, title: 'Beach Clubs', icon: true },
    { id: 4, image: hookahImage, title: 'Shisha Lounges', icon: true },
    { id: 5, image: concertImage, title: 'Concerts', icon: true },
    { id: 6, image: poolImage, title: 'Swimming Pools', icon: true },
    { id: 7, image: turfImage, title: 'Turfs', icon: true }
  ];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/event/get-events-by-user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
        const data = await response.json();
        if (response.ok) {
          setRealEvents(data.events);
        } else {
          console.error('Failed to fetch events:', data.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async (eventId, ticketCount) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load.');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/payment/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: eventId, ticketCount: ticketCount })
      });
      const data = await response.json();
      const { order } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LockMyTicket",
        description: "Event Ticket Purchase",
        order_id: order.id,
        handler: async function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
          const result = await fetch(`${import.meta.env.VITE_BASE_URL}/api/payment/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              event_id: eventId,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              count: ticketCount
            })
          });
          const data = await result.json();
          if (result.ok) {
            alert("Payment verified successfully!");
          } else {
            alert("Payment verification failed: " + data.error);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        notes: {
          eventId,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <main className="flex-1 py-6">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h1>
          </div>

          <div className="grid grid-cols-7 gap-2 items-start mb-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                image={event.image}
                title={event.title}
                onClick={() => console.log(`Clicked event: ${event.title}`)}
                compact={true}
                icon={event.icon}
                transparent={event.icon ? true : false}
              />
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-2 mt-8">Live & Upcoming Events</h2>
          <div className="max-h-[520px] overflow-y-auto rounded-lg border border-gray-700/40 bg-gray-800/30 p-4 shadow-lg flex flex-col gap-6">
            {realEvents.map(ev => (
              <OrganizerEventCard key={ev.id} event={ev} readOnly onPay={handlePay}/>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
