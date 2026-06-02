import { create } from "zustand";
import type { PayloadPenggunaInternalType } from "../models/penggunaInternal.model";

type AuthState = {
  pengguna: PayloadPenggunaInternalType | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setPengguna: (pengguna: PayloadPenggunaInternalType | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  pengguna: null,
  isAuthenticated: false,
  isInitialized: false,

  setPengguna: (pengguna) =>
    set({
      pengguna,
      isAuthenticated: !!pengguna,
      isInitialized: true,
    }),

  logout: () =>
    set({
      pengguna: null,
      isAuthenticated: false,
      isInitialized: true,
    }),
}));
