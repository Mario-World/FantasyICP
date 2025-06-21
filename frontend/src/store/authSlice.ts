// src/store/authSlice.ts
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  identity: any;
  isLoading: boolean;
  error: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setAuth: (auth: { identity: any; user: any }) => void;
  setNoAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  identity: null,
  isLoading: true,
  error: null,

  login: async () => {
    // This will be handled by the ConnectWallet component
  },

  logout: async () => {
    // This will be handled by the ConnectWallet component
  },

  checkAuth: async () => {
    // This will be handled by the useAuth hook
  },

  setAuth: (auth) => {
    set({
      isAuthenticated: true,
      user: auth.user,
      identity: auth.identity,
      isLoading: false,
    });
  },

  setNoAuth: () => {
    set({
      isAuthenticated: false,
      user: null,
      identity: null,
      isLoading: false,
    });
  },
})); 