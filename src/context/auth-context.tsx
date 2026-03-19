
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/lib/api-config';

interface User {
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('questflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    if (!API_URL) return false;
    
    try {
      const response = await fetch(`${API_URL}?action=getRole&email=${email.toLowerCase()}`);
      const data = await response.json();
      
      if (data && data.role) {
        const newUser: User = {
          email: email.toLowerCase(),
          role: data.role as 'admin' | 'user',
          displayName: email.split('@')[0]
        };
        setUser(newUser);
        localStorage.setItem('questflow_user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('questflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
