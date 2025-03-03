import { create } from 'zustand';
import { translations } from '../constants/translations';

type LanguageState = {
  language: string;
  translations: Record<string, any>;
  setLanguage: (language: string) => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'English',
  translations: translations.English,
  setLanguage: (language: string) => set({ 
    language, 
    translations: translations[language] || translations.English 
  }),
}));