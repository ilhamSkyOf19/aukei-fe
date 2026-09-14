import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  update: boolean;
  transactionId: number | null;

  setUpdate: (value: { update: boolean; transactionId: number | null }) => void;

  resetUpdate: () => void;
};

export const useTransactionComplate = create<State>()(
  persist(
    (set) => ({
      update: false,
      next: false,
      transactionId: null,

      setUpdate: (value) =>
        set({
          update: value.update,
          transactionId: value.transactionId,
        }),

      resetUpdate: () =>
        set({
          update: false,
          transactionId: null,
        }),
    }),
    {
      name: "transaction-complate-update",
    },
  ),
);
