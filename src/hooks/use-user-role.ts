
"use client";

import { useAuth } from '@/context/auth-context';

export function useUserRole() {
  const { user, loading } = useAuth();
  
  return { 
    role: user?.role || null, 
    loading, 
    user 
  };
}
