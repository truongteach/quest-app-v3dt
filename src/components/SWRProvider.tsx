
"use client";

import React from 'react';
import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
}

/**
 * DNTRNG™ SESSION CACHE REGISTRY
 * 
 * Implements SWR with cross-navigation persistence.
 * Leverages sessionStorage for the stable tests library to enable instant hydration.
 */
export function SWRProvider({ children }: SWRProviderProps) {
  const sessionStorageProvider = () => {
    if (typeof window === 'undefined') return new Map();
    
    // Load existing cache from session storage
    const map = new Map(
      JSON.parse(sessionStorage.getItem('swr-cache') || '[]')
    );

    // Persistence Protocol: Save stable cache keys on unload
    window.addEventListener('beforeunload', () => {
      // Only persist stable, non-sensitive data
      const persistentKeys = ['tests', 'settings'];
      const dataToSave = Array.from(map.entries()).filter(([key]) => 
        persistentKeys.includes(String(key))
      );
      sessionStorage.setItem('swr-cache', JSON.stringify(dataToSave));
    });

    return map;
  };

  return (
    <SWRConfig 
      value={{
        fetcher: (url: string) => fetch(url).then(res => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 60000, // 1 minute
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        provider: sessionStorageProvider
      }}
    >
      {children}
    </SWRConfig>
  );
}
