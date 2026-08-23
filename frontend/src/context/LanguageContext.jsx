import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ecoclean_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('ecoclean_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ml' : 'en'));
  };

  // Helper translation function with fallback
  const t = (key, fallback) => {
    const currentDict = translations[language] || translations.en;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    const defaultDict = translations.en;
    if (defaultDict && defaultDict[key] !== undefined) {
      return defaultDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
