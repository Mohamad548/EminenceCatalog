
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // In a real app, you'd validate the token with the server.
            // Here, we'll just assume it's valid and set a dummy user.
            setUser({ id: 1, username: 'admin' });
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const loggedInUser = await api.login(username, password);
            if (loggedInUser) {
                setUser(loggedInUser);
                localStorage.setItem('authToken', `fake-token-for-${loggedInUser.username}`);
                setIsLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Login failed", error);
        }
        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
