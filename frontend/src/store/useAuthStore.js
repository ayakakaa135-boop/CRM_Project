import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      
      login: (userData, authToken, refreshToken = null) => {
        set({ user: userData, token: authToken, refreshToken });
        localStorage.setItem('token', authToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      },
      
      logout: () => {
        set({ user: null, token: null, refreshToken: null });
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      },
      
      setUser: (userData) => set({ user: userData }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
