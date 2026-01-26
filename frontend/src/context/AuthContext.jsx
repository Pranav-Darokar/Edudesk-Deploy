import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const decodeAndSetUser = (token) => {
        try {
            const decoded = jwtDecode(token);
            setUser({
                email: decoded.sub,
                role: decoded.role,
                name: decoded.name
            });
        } catch (error) {
            console.error("Failed to decode token", error);
            setUser(null);
        }
    };

    useEffect(() => {
        if (token) {
            decodeAndSetUser(token);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            decodeAndSetUser(token);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const signup = async (email, password, name, role) => {
        try {
            const response = await api.post('/auth/signup', { email, password, name, role });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            decodeAndSetUser(token);
            return true;
        } catch (error) {
            console.error("Signup failed", error);
            const message = error.response?.data?.error || 'Signup failed';
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
