import { create } from "zustand";
import { persist } from "zustand/middleware";

type KategoriChoose = {
  id: number;
  nama: string;
};

type KategoriChooseState = {
  kategori: KategoriChoose;

  setKategori: (kategori: KategoriChoose) => void;
  resetKategori: () => void;
};

export const useKategoriChooseStore = create<KategoriChooseState>()(
  persist(
    (set) => ({
      kategori: {
        id: 0,
        nama: "",
      },

      setKategori: (kategori) =>
        set({
          kategori,
        }),

      resetKategori: () =>
        set({
          kategori: {
            id: 0,
            nama: "",
          },
        }),
    }),
    {
      name: "kategori-choose-storage",
    },
  ),
);
