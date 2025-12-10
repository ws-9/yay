import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthStore = {
  token: string | null;
  actions: {
    login: (token: string) => void;
    logout: () => void;
  };
};

const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      token: null,
      actions: {
        login: token => set({ token }),
        logout: () => set({ token: null }),
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ token: state.token }),
    },
  ),
);

export function useToken() {
  return useAuthStore(state => state.token);
}

export function useAuthActions() {
  return useAuthStore(state => state.actions);
}

export function useIsAuthenticated() {
  return useAuthStore(state => state.token !== null);
}
