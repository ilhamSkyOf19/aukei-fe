import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotifikasiPilihanType =
  | "produk"
  | "tempo"
  | "pengajuanBarang"
  | "pengajuanReturBarang";

interface NotifikasiStore {
  selectedNotifikasi: NotifikasiPilihanType;
  setSelectedNotifikasi: (selected: NotifikasiPilihanType) => void;
  resetNotifikasi: () => void;
}

export const useNotifikasiStore = create<NotifikasiStore>()(
  persist(
    (set) => ({
      selectedNotifikasi: "produk",

      setSelectedNotifikasi: (selectedNotifikasi) =>
        set({
          selectedNotifikasi,
        }),

      resetNotifikasi: () =>
        set({
          selectedNotifikasi: "produk",
        }),
    }),
    {
      name: "notifikasi-store",
    },
  ),
);
