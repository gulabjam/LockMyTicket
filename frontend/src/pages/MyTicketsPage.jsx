import React, { useEffect, useState, useContext } from "react";
import Ticket from "../components/Ticket";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MyTicketsPage = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const fetchTickets = async () => {
        if (!token) {
          setError("Missing authentication token");
          setLoading(false);
          return;
        }
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/tickets/my-tickets`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch tickets");
          }
          const data = await response.json();
          setTickets(data.tickets || []);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTickets();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      {loading && <div className="text-gray-400">Loading tickets...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {!loading && !error && tickets.length === 0 && (
        <div className="text-gray-400">No tickets found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {tickets.map((ticket) => (
          <Ticket key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
        <Footer />
    </div>
  );
};

export default MyTicketsPage;
