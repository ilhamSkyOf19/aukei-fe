import { create } from "zustand";

type ShadowState = {
  shadowIsActive: boolean;
  shadowId: number | null;
  setShadowIsActive: (params: {
    shadowIsActive: boolean;
    shadowId?: number | null;
  }) => void;
};

export const useShadowStore = create<ShadowState>((set) => ({
  shadowIsActive: false,
  shadowId: null,
  setShadowIsActive: (shadowIsActive) =>
    set({
      shadowIsActive: shadowIsActive.shadowIsActive,
      shadowId: shadowIsActive.shadowId,
    }),
}));
