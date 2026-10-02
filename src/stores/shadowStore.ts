import { create } from "zustand";

type ShadowState = {
  shadowIsActive: boolean;
  shadowId: number | null;
  showNavigation: boolean;
  setShadowIsActive: (params: {
    shadowIsActive: boolean;
    showNavigation?: boolean;
    shadowId?: number | null;
  }) => void;
};

export const useShadowStore = create<ShadowState>((set) => ({
  shadowIsActive: false,
  showNavigation: false,
  shadowId: null,
  setShadowIsActive: (shadowIsActive) =>
    set({
      shadowIsActive: shadowIsActive.shadowIsActive,
      shadowId: shadowIsActive.shadowId,
      showNavigation: shadowIsActive.showNavigation,
    }),
}));
