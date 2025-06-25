import { createContext } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<void>;
    refreshUserData: () => Promise<void>;
    clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
