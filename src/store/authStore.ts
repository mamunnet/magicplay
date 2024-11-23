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
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

// Get environment variables
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// Validate environment variables
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Admin credentials not properly configured in environment variables');
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isLoading: false,
      error: null,
      
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Debug environment variables and credentials
          console.log('Auth Debug:', {
            adminEmailSet: !!ADMIN_EMAIL,
            adminPasswordSet: !!ADMIN_PASSWORD,
            providedEmail: email,
            emailMatch: email === ADMIN_EMAIL,
            providedPasswordLength: password?.length,
            expectedPasswordLength: ADMIN_PASSWORD?.length,
            providedPassword: password,
            expectedPassword: ADMIN_PASSWORD,
            passwordsMatch: password === ADMIN_PASSWORD
          });

          if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error('Admin credentials not properly configured');
          }

          // Only allow specific admin email
          if (email !== ADMIN_EMAIL) {
            throw new Error('Invalid email address');
          }

          // Check password (exact match, no trimming)
          if (password !== ADMIN_PASSWORD) {
            throw new Error('Invalid password');
          }

          set({ 
            user: { email, isAdmin: true },
            isAdmin: true,
            isLoading: false,
            error: null
          });

          console.log('Login successful');
        } catch (error: any) {
          console.error('Login error:', error);
          set({ 
            error: error.message,
            isLoading: false,
            user: null,
            isAdmin: false
          });
          throw error;
        }
      },

      signOut: () => {
        set({ 
          user: null,
          isAdmin: false,
          isLoading: false,
          error: null
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
        isAdmin: state.isAdmin
      })
    }
  )
);