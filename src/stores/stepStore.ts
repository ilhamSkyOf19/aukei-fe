import { create } from "zustand";

type StepState = {
  step: number;
  setStep: (step: number) => void;
  resetStep: () => void;
};

export const useStepStore = create<StepState>((set) => ({
  step: 1,

  setStep: (step) =>
    set({
      step,
    }),

  resetStep: () =>
    set({
      step: 1,
    }),
}));
