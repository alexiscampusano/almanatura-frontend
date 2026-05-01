import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type AuthLoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};

type AuthState = {
  accessToken: string | null;
  tokenType: string | null;
  expiresAt: number | null;
  user: AuthUser | null;
  isSessionExpired: boolean;
  setSession: (session: AuthLoginResponse) => void;
  validateSession: () => void;
  clearSession: () => void;
};

const sessionStorageJSON = createJSONStorage(() => sessionStorage);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      tokenType: null,
      expiresAt: null,
      user: null,
      isSessionExpired: false,
      setSession: ({ accessToken, tokenType, expiresIn, user }) =>
        set({
          accessToken,
          tokenType,
          expiresAt: Date.now() + expiresIn * 1000,
          user,
          isSessionExpired: false,
        }),
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
          tokenType: null,
          expiresAt: null,
          user: null,
          isSessionExpired: false,
        }),
    }),
    { name: "alma-natura-auth", storage: sessionStorageJSON },
  ),
);
