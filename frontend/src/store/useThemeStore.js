import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      direction: 'rtl',
      language: 'ar',
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
      setLanguage: (lang) => set({ 
        language: lang, 
        direction: lang === 'ar' ? 'rtl' : 'ltr' 
      }),
      setDirection: (direction) => set({ direction }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
