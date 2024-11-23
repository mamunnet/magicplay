import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isLoading: false,
      error: null,
      isHydrated: false,
      
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          // Hardcoded credentials for development
          const validEmail = 'mariawebtech.contact@gmail.com';
          const validPassword = 'Mamunnet@#13';

          if (email.trim().toLowerCase() !== validEmail.toLowerCase()) {
            throw new Error('Invalid email address');
          }

          if (password !== validPassword) {
            throw new Error('Invalid password');
          }

          const user = { email, isAdmin: true };
          
          // Set user data and admin status
          set({ 
            user,
            isAdmin: true,
            isLoading: false,
            error: null,
            isHydrated: true
          });

        } catch (error: any) {
          set({ 
            user: null,
            isAdmin: false,
            isLoading: false,
            error: error.message,
            isHydrated: true
          });
          throw error;
        }
      },

      signOut: () => {
        set({ 
          user: null, 
          isAdmin: false, 
          error: null,
          isHydrated: true
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAdmin: state.isAdmin,
        isHydrated: true
      })
    }
  )
);