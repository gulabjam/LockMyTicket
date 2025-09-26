import React from 'react'
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const stored_user = localStorage.getItem('user');
        const stored_token = localStorage.getItem('token');
        if (stored_user && stored_token){
            setUser(JSON.parse(stored_user));
            setToken(stored_token);
        }
        setLoading(false);
    }, [])

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(userData)); 
        localStorage.setItem('token', token);
    }

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/signIn');
    }

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

