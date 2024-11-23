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
  updatePassword: (params: { currentPassword: string; newPassword: string }) => Promise<void>;
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

      updatePassword: async ({ currentPassword, newPassword }) => {
        try {
          // Hardcoded password for development
          const validPassword = 'Mamunnet@#13';

          if (currentPassword !== validPassword) {
            throw new Error('Current password is incorrect');
          }

          if (newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
          }

          // In a real application, you would make an API call here to update the password
          // For now, we'll just validate the current password
          
          // No need to update the state since we're not storing the password
          return;
        } catch (error: any) {
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