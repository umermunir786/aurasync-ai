import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '../services/AuthService';
import type { User } from '../services/AuthService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('username', email); // OAuth2PasswordRequestForm expects 'username'
          formData.append('password', password);
          
          const { access_token } = await AuthService.login(formData);
          localStorage.setItem('token', access_token);
          
          // Get user profile after login
          const user = await AuthService.getProfile();
          
          set({ user, token: access_token, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          const message = err.response?.data?.detail || 'Login failed';
          set({ error: message, isLoading: false });
          throw err;
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  return store;
};
