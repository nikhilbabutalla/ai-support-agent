'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from './api';
import { mockUser, mockAdminUser } from './mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // In production, replace with actual API call:
      // const response = await authApi.login(email, password);
      // setUser(response.user);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      const loggedInUser = email.includes('admin') ? mockAdminUser : mockUser;
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    try {
      // In production, replace with actual API call:
      // const response = await authApi.register(name, email, password);
      // setUser(response.user);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
