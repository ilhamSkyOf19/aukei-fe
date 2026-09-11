import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  update: boolean;
  next: boolean;
  transactionId: number | null;

  setUpdate: (value: { update: boolean; transactionId: number | null }) => void;
  setNext: (value: { next: boolean; transactionId: number | null }) => void;

  resetUpdate: () => void;
  resetNext: () => void;
  resetCart: () => void;
};

export const useCartStore = create<CartState>()(
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

      setNext: (value) =>
        set({
          next: value.next,
          transactionId: value.transactionId,
        }),

      resetUpdate: () =>
        set({
          update: false,
          transactionId: null,
        }),

      resetNext: () =>
        set({
          next: false,
          transactionId: null,
        }),

      resetCart: () =>
        set({
          update: false,
          next: false,
          transactionId: null,
        }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
