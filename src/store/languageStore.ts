import { create } from 'zustand';

type LanguageStore = {
  language: 'fr' | 'en';
  setLanguage: (language: 'fr' | 'en') => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'fr',
  setLanguage: (language) => set({ language }),
}));