import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type AuthLoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  user: AuthUser;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresAt: number | null;
  user: AuthUser | null;
  isSessionExpired: boolean;
  setSession: (session: AuthLoginResponse) => void;
  updateTokens: (tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }) => void;
  updateUser: (user: AuthUser) => void;
  validateSession: () => void;
  clearSession: () => void;
};

const sessionStorageJSON = createJSONStorage(() => sessionStorage);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresAt: null,
      user: null,
      isSessionExpired: false,
      setSession: ({ accessToken, refreshToken, tokenType, expiresIn, user }) =>
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
          tokenType,
          expiresAt: Date.now() + expiresIn * 1000,
          user,
          isSessionExpired: false,
        }),
      updateTokens: ({ accessToken, refreshToken, expiresIn }) =>
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
          expiresAt: Date.now() + expiresIn * 1000,
          isSessionExpired: false,
        }),
      updateUser: (user) => set({ user }),
      validateSession: () =>
        set((state) => {
          if (state.expiresAt === null) {
            return { isSessionExpired: false };
          }

          return { isSessionExpired: Date.now() > state.expiresAt };
        }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          tokenType: null,
          expiresAt: null,
          user: null,
          isSessionExpired: false,
        }),
    }),
    { name: "alma-natura-auth", storage: sessionStorageJSON },
  ),
);
