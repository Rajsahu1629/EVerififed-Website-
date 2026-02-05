import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Recruiter } from '../services/api';

interface AuthContextType {
    user: User | null;
    recruiter: Recruiter | null;
    isAdmin: boolean;
    isLoading: boolean;
    loginUser: (user: User) => void;
    loginRecruiter: (recruiter: Recruiter) => void;
    loginAdmin: () => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'everified_user';
const RECRUITER_KEY = 'everified_recruiter';
const ADMIN_KEY = 'everified_admin';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load session from localStorage
        try {
            const savedUser = localStorage.getItem(USER_KEY);
            const savedRecruiter = localStorage.getItem(RECRUITER_KEY);
            const savedAdmin = localStorage.getItem(ADMIN_KEY);

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else if (savedRecruiter) {
                setRecruiter(JSON.parse(savedRecruiter));
            } else if (savedAdmin) {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error('Error loading session:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loginUser = (userData: User) => {
        setUser(userData);
        setRecruiter(null);
        setIsAdmin(false);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.removeItem(RECRUITER_KEY);
        localStorage.removeItem(ADMIN_KEY);
    };

    const loginRecruiter = (recruiterData: Recruiter) => {
        setRecruiter(recruiterData);
        setUser(null);
        setIsAdmin(false);
        localStorage.setItem(RECRUITER_KEY, JSON.stringify(recruiterData));
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ADMIN_KEY);
    };

    const loginAdmin = () => {
        setIsAdmin(true);
        setUser(null);
        setRecruiter(null);
        localStorage.setItem(ADMIN_KEY, 'true');
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(RECRUITER_KEY);
    };

    const logout = () => {
        setUser(null);
        setRecruiter(null);
        setIsAdmin(false);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(RECRUITER_KEY);
        localStorage.removeItem(ADMIN_KEY);
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                recruiter,
                isAdmin,
                isLoading,
                loginUser,
                loginRecruiter,
                loginAdmin,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
