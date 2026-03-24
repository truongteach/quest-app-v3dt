
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/lib/api-config';

interface User {
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
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

  const getDeviceDetails = () => {
    if (typeof window === 'undefined') return 'N/A';
    const ua = navigator.userAgent;
    let device = "Unknown Device";
    
    if (/android/i.test(ua)) device = "Android";
    else if (/iPad|iPhone|iPod/.test(ua)) device = "iOS";
    else if (/Windows/i.test(ua)) device = "Windows";
    else if (/Mac/i.test(ua)) device = "macOS";
    else if (/Linux/i.test(ua)) device = "Linux";
    
    let browser = "Browser";
    if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";
    
    return `${device} (${browser})`;
  };

  const logActivity = async (email: string, name: string, event: 'Login' | 'Logout') => {
    if (!API_URL) return;
    try {
      let ip = 'N/A';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (e) {
        console.warn("Could not fetch IP", e);
      }

      const device = getDeviceDetails();

      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: 'logActivity', 
          email, 
          name, 
          event,
          ip,
          device
        })
      });
    } catch (e) {
      console.error("Failed to log activity", e);
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!API_URL) return false;
    
    try {
      const url = new URL(API_URL);
      url.searchParams.append('action', 'login');
      url.searchParams.append('email', email.toLowerCase());
      if (password) url.searchParams.append('password', password);
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data && data.role) {
        const newUser: User = {
          email: email.toLowerCase(),
          role: data.role as 'admin' | 'user',
          displayName: data.name || email.split('@')[0],
          id: data.id
        };
        setUser(newUser);
        localStorage.setItem('questflow_user', JSON.stringify(newUser));
        
        // Log Login Activity with IP and Device
        logActivity(newUser.email, newUser.displayName || 'User', 'Login');
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    if (user) {
      // Log Logout Activity before state clear
      logActivity(user.email, user.displayName || 'User', 'Logout');
    }
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
