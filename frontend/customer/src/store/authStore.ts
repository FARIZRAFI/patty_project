import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('patty_token'),
  user: localStorage.getItem('patty_user') ? JSON.parse(localStorage.getItem('patty_user')!) : null,
  setAuth: (token, user) => {
    localStorage.setItem('patty_token', token);
    localStorage.setItem('patty_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('patty_token');
    localStorage.removeItem('patty_user');
    set({ token: null, user: null });
  },
}));
