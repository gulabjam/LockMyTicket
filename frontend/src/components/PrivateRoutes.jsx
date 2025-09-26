import React from 'react';
import { Navigate } from 'react-router-dom';


const PrivateRoutes = ({children}) => {
        const stored_user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (stored_user && token) {
            return children;
        }
        return <Navigate to="/signIn" />
}

export default PrivateRoutes