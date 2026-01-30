import { create } from 'zustand';

type AuthStore = {
  token: string | null;
  actions: {
    login: (token: string) => void;
    logout: () => void;
  };
};

const useAuthStore = create<AuthStore>(set => ({
  token: null,
  actions: {
    login: token => set({ token }),
    logout: () => set({ token: null }),
  },
}));

export function useToken() {
  return useAuthStore(state => state.token);
}

export function useAuthActions() {
  return useAuthStore(state => state.actions);
}

export function useIsAuthenticated() {
  return useAuthStore(state => state.token !== null);
}

export function getTokenState() {
  return useAuthStore.getState();
}
