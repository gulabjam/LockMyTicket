import React from 'react';
import UserDashboard from '../components/UserDashboard';
import OrganizerDashboard from '../components/OrganizerDashboard';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    if (user.role === 'attendee')
      return <UserDashboard />;
    if (user.role === 'organizer')
      return <OrganizerDashboard />;
};

export default DashboardPage;
