import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
};

/**
 * Global auth store.
 * AuthSync (in providers.tsx) keeps this in sync with the NextAuth session.
 * The axios interceptor in http.ts reads from here for every request automatically.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
}));
