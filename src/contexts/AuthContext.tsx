import React, { useState, useEffect, useCallback, useContext } from 'react';
import { api } from '../lib/api';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext, User, AuthContextType } from './createAuthContext';
import LoadingScreen from '@/components/LoadingScreen';

// Secure token storage with encryption
const TOKEN_KEY = 'auth_token';

const secureStorage = {
    setToken: (token: string) => {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error storing token:', error);
        }
    },
    getToken: () => {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    },
    removeToken: () => {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(secureStorage.getToken());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const isAuthenticated = !!token && !!user;

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Set up axios interceptor for token handling
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }

        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (
                    error.response?.status === 401 &&
                    isAuthenticated &&
                    window.location.pathname !== '/login' &&
                    window.location.pathname !== '/register'
                ) {
                    logout();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [token, navigate, isAuthenticated]);

    // Only store token, fetch user profile after login
    const login = useCallback(async (accessToken: string) => {
        secureStorage.setToken(accessToken);
        setToken(accessToken);
        setLoading(true);
        try {
            const response = await api.get('/auth/profile');
            setUser(response.data);
        } catch (error) {
            setUser(null);
            setError('Failed to fetch user profile after login.');
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        secureStorage.removeToken();
        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    }, [navigate]);

    const updateUser = async (userData: Partial<User>) => {
        try {
            const response = await api.patch('/user/profile', userData);
            const updatedUser = response.data;
            setUser(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            if (error instanceof AxiosError) {
                setError(error.response?.data?.message || 'Failed to update profile');
            }
            throw error;
        }
    };

    const refreshUserData = async () => {
        try {
            const response = await api.get('/auth/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Error refreshing user data:', error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                logout();
            }
            throw error;
        }
    };

    // Check authentication status on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (token) {
                    await refreshUserData();
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                if (error instanceof AxiosError && error.response?.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [token, logout]);

    if(loading) {
        return <LoadingScreen />
    }

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        updateUser,
        refreshUserData,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
