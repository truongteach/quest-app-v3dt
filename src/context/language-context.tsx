"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'vi' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [dictionary, setDictionary] = useState<Record<string, string>>({});

  const loadDictionary = useCallback(async (lang: Language) => {
    try {
      let bundle;
      switch (lang) {
        case 'vi':
          bundle = await import('@/locales/vi');
          setDictionary(bundle.vi);
          break;
        case 'es':
          bundle = await import('@/locales/es');
          setDictionary(bundle.es);
          break;
        default:
          bundle = await import('@/locales/en');
          setDictionary(bundle.en);
          break;
      }
    } catch (error) {
      console.error(`Failed to load dictionary for ${lang}`, error);
      // Fallback to English if load fails
      const fallback = await import('@/locales/en');
      setDictionary(fallback.en);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('dntrng_admin_lang') as Language;
    const initialLang = (saved === 'en' || saved === 'vi' || saved === 'es') ? saved : 'en';
    setLanguageState(initialLang);
    loadDictionary(initialLang);
  }, [loadDictionary]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dntrng_admin_lang', lang);
    loadDictionary(lang);
  };

  const t = (key: string) => {
    return dictionary[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
