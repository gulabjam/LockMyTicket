import React, { useState, useContext} from 'react';
import { Menu, X, PlusCircle, List, User, FileText, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const role = user?.role;
  const isOrganizerPage = (location.pathname === '/organizer-dashboard' || location.pathname.startsWith('/organizer')) && role === 'organizer';
   return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold text-white">
              LockMyTicket
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            {role === 'organizer' ? (
              <div className="flex items-center gap-3">
                <button onClick={()=>navigate('/create-event')} aria-label="Create event" className="inline-flex items-center gap-2 bg-transparent border border-gray-800 text-gray-200 px-4 py-2 rounded-md font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-colors duration-200">
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Event</span>
                </button>

                <button onClick={()=>navigate('/my-events')} aria-label="My events" className="inline-flex items-center gap-2 bg-transparent border border-gray-800 text-gray-200 px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-orange-500 hover:text-white transition-colors duration-200">
                  <List className="w-5 h-5" />
                  <span>My Events</span>
                </button>

                <button onClick={()=>navigate('/organizer-details')} aria-label="Organizer details" className="inline-flex items-center gap-2 bg-transparent border border-gray-800 text-gray-200 px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-orange-500 hover:text-white transition-colors duration-200">
                  <FileText className="w-5 h-5" />
                  <span>Details</span>
                </button>

                <div className="h-6 w-px bg-gray-700 mx-2" />

                <button onClick={()=>navigate('/profile')} aria-label="Profile" className="inline-flex items-center gap-2 bg-transparent border border-gray-800 text-gray-200 px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-orange-500 hover:text-white transition-colors duration-200">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>

                <button onClick={logout} aria-label="Logout" className="inline-flex items-center gap-2 bg-transparent border border-gray-800 text-gray-200 px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-orange-500 hover:text-white transition-colors duration-200">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (role == 'attendee' ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-all duration-300">
                  <span className="inline-block w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">{user?.name.charAt(0)}</span>
                  <span className="font-semibold">Profile</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  <button onClick={()=>navigate('/dashboard')} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">Dashboard</button>
                  <button onClick={()=>navigate('/my-tickets')} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">My Tickets</button>
                  <button onClick={()=>navigate('/profile')} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">Profile</button>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>navigate('/signIn')} className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                Get Started
              </button>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-orange-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-2 space-y-1">
            {isOrganizerPage ? (
              <>
                <button onClick={()=>navigate('/create-event')} aria-label="Create event" className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200 rounded-md">
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Event</span>
                </button>

                <button onClick={()=>navigate('/my-events')} aria-label="My events" className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200 rounded-md">
                  <List className="w-5 h-5" />
                  <span>My Events</span>
                </button>

                <button onClick={()=>navigate('/organizer-details')} aria-label="Organizer details" className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200 rounded-md">
                  <FileText className="w-5 h-5" />
                  <span>Details</span>
                </button>

                <button onClick={()=>navigate('/profile')} aria-label="Profile" className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200 rounded-md">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>

                <button onClick={()=>{setIsMenuOpen(false); logout();}} aria-label="Logout" className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-orange-500 hover:text-white transition-colors duration-200 rounded-md">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (location.pathname === '/dashboard' ? (
              <>
                <button onClick={()=>navigate('/dashboard')} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">Dashboard</button>
                <button onClick={()=>navigate('/my-tickets')} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">My Tickets</button>
                <button onClick={()=>navigate('/profile')} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">Profile</button>
                <button onClick={()=>{setIsMenuOpen(false); logout();}} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-orange-500">Logout</button>
              </>
            ) : (
              <button onClick={()=>navigate('/signIn')} className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-full mt-2">
                Get Started
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
