import { create } from "zustand";
import { persist } from "zustand/middleware";
// type
interface IsModeKasirStoreType {
  isModeKasir: boolean;
  setIsModeKasir: (value: boolean) => void;
}

const useIsModeKasirStore = create<IsModeKasirStoreType>()(
  persist(
    (set) => ({
      isModeKasir: false,
      setIsModeKasir: (value) =>
        set({
          isModeKasir: value,
        }),
    }),
    {
      name: "mode-kasir-store",
    },
  ),
);

export default useIsModeKasirStore;
