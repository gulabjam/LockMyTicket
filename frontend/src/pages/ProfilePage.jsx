import React, { useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [ user, setUser ] = useState({
    name: '',
    email: '', 
    role: ''
  });
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchUserProfile = async () => { 
        try {
            console.log("Auth Token:", token);
            if (!token) {
              console.error("No token found");
              return;
            }
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/fetchProfile`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "Authorization" : `Bearer ${token}`
            }
            });
            const data = await response.json();
            if (response.ok) {
            setUser({
                name : data.user.name,  
                email : data.user.email,
                role : data.user.role
            });
            } else {
                console.error('Failed to fetch user profile:', data.error);
                if (response.status === 401) {
                    console.error('Authentication failed: Token may be invalid or expired');
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                console.error('Backend server may not be running');
            }
        }
        }
        fetchUserProfile();
    },[token]);

    // initialize editedName when entering edit mode
    useEffect(() => {
      if (isEditing) setEditedName(user?.name || '');
    }, [isEditing, user]);

    const handleUpdateName = async () => {
      if (!editedName || editedName.trim().length === 0) return;
      // optimistic update locally
      const prev = user.name;
      setUser((u) => ({ ...u, name: editedName }));
      setIsEditing(false);

      // attempt server update (best-effort). Endpoint may vary; handle failures gracefully.
      try {
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/update-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: editedName })
        });
        const data = await res.json();
        if (!res.ok) {
          console.error('Failed to update name on server', data);
          // rollback optimistic update
          setUser((u) => ({ ...u, name: prev }));
        }
      } catch (err) {
        console.error('Error updating name:', err);
        setUser((u) => ({ ...u, name: prev }));
      }
    };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          
          {isEditing ? (
            <div className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter new name"
              />
              <button
                onClick={handleUpdateName}
                className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-orange-500 hover:text-orange-400"
              >
                ✏️ Edit
              </button>
            </div>
          )}

          <div className="w-full border-t border-gray-700 my-4"></div>
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">Email:</span>
              <span className="text-white font-semibold">{user?.email || 'No email available'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">Role:</span>
              <span className="text-white font-semibold">{user?.role || 'N/A'}</span>
            </div>
          </div>

          <div className="w-full border-t border-gray-700 my-4"></div>
          <div className="w-full flex flex-col gap-3">
            {user?.role === 'attendee' && (
              <button
                onClick={() => navigate('/register-organizer')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:from-orange-600 hover:to-orange-800"
              >
                Become an Organizer
              </button>
            )}
            <button
              onClick={() => setShowSupportModal(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Support Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Contact Support</h3>
              <p className="text-gray-300 mb-4">
                Need help? Our support team is available 24/7.
              </p>
              <div className="mb-4">
                <a 
                  href="mailto:support@lockmyticket.com"
                  className="text-orange-500 hover:text-orange-400 block mb-2"
                >
                  📧 support@lockmyticket.com
                </a>
                <a 
                  href="tel:+1234567890"
                  className="text-orange-500 hover:text-orange-400 block"
                >
                  📞 +91 8217068791
                </a>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
