import React, { ReactNode, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLanguageStore, LanguageContext } from '../store/languageStore';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const languageStore = useLanguageStore();
  
  // Initialize language on first load
  useEffect(() => {
    const initLanguage = async () => {
      await languageStore.initializeLanguage();
    };
    
    initLanguage();
  }, []);
  
  return (
    <LanguageContext.Provider value={languageStore}>
      {children}
    </LanguageContext.Provider>
  );
}; 