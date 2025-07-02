import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load token and user from localStorage on mount
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken) {
            setToken(savedToken);
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            } else {
                // Only validate token if we don't have user data
                validateToken(savedToken);
            }
        }
        setLoading(false);
    }, []);

    // Validate token with the backend
    const validateToken = async (currentToken) => {
        try {
            await axios.post('http://localhost:5001/api/v1/auth/validate-token', {}, {
                headers: {
                    Authorization: `Bearer ${currentToken}`
                }
            });
            // Token is valid, but we don't have user data
            // You might want to fetch user data here if needed
        } catch (err) {
            console.error('Token validation error:', err);
            // Token is invalid, log out
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(
                'http://localhost:5001/api/v1/auth/login',
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        } catch (err) {
            console.error('Login error:', err.response?.data?.error || err.message);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};