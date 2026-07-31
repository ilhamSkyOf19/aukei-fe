import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LaporanPilihanType =
  | "semua"
  | "penjualan"
  | "barang"
  | "booking"
  | "pantauanStok"
  | "topProduk"
  | "topPelanggan";

interface LaporanStore {
  selectedLaporan: LaporanPilihanType;
  setSelectedLaporan: (selected: LaporanPilihanType) => void;
  resetLaporan: () => void;
}

export const useLaporanStore = create<LaporanStore>()(
  persist(
    (set) => ({
      selectedLaporan: "semua",

      setSelectedLaporan: (selectedLaporan) =>
        set({
          selectedLaporan,
        }),

      resetLaporan: () =>
        set({
          selectedLaporan: "semua",
        }),
    }),
    {
      name: "laporan-store",
    },
  ),
);
