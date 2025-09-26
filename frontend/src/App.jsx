import React from 'react';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import {Routes, Route} from 'react-router-dom';
import PrivateRoutes from './components/PrivateRoutes';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import RegisterOrganizerPage from './pages/RegisterOrganizerPage';
import MyTicketsPage from './pages/MyTicketsPage';



function App() {
  const {user} = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* List of public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          {/* List of public routes */}
          {/* List of private routes */}
          <Route path="/dashboard" element={
            <PrivateRoutes>
              <DashboardPage/>
            </PrivateRoutes>
          } />
          <Route path="/profile" element={
            <PrivateRoutes>
              <ProfilePage/>
            </PrivateRoutes>
          } />
          <Route path="/register-organizer" element={
            <PrivateRoutes>
              <RegisterOrganizerPage/>
            </PrivateRoutes>
          } />
          <Route path="/create-event" element={
            <PrivateRoutes>
              <CreateEventPage />
            </PrivateRoutes>
          } />
          <Route path="/my-events" element={
            <PrivateRoutes>
              <MyEventsPage />
            </PrivateRoutes>
          } />
          <Route path="/my-tickets" element={
            <PrivateRoutes>
              <MyTicketsPage/>
            </PrivateRoutes>
          } />
          {/* List of private routes */}
        </Routes>
    </div>
  );
}

export default App;