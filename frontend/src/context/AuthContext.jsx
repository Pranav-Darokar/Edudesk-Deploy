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
            // Propagate the specific error message (e.g. from our interceptor)
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            const { token } = response.data;
            if (token) {
                localStorage.setItem('token', token);
                setToken(token);
                decodeAndSetUser(token);
            }
            return true;
        } catch (error) {
            console.error("Signup failed", error);
            const message = error.response?.data?.error || error.message || 'Signup failed';
            throw new Error(message);
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            await api.post('/auth/verify-otp', { email, otp });
            return true;
        } catch (error) {
            console.error("OTP verification failed", error);
            const message = error.response?.data?.error || 'Verification failed';
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, verifyOtp, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
