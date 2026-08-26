import { create } from "zustand";
import { persist } from "zustand/middleware";

type StepState = {
  step: number;
  setStep: (step: number) => void;
  resetStep: () => void;
};

export const useStepStore = create<StepState>()(
  persist(
    (set) => ({
      step: 1,

      setStep: (step) =>
        set({
          step,
        }),

      resetStep: () =>
        set({
          step: 1,
        }),
    }),
    {
      name: "step-storage",
    },
  ),
);
