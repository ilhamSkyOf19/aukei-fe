import type { PaymentMethodType } from "../types/constant.type";

export type ResponseTransactionPaymentOldType = {
  id: number;
  transactionId: number;
  ongkir: number | null;
  totalDiskon: number;
  totalBayar: number;
  totalDiBayar: number;
  metodePembayaran: PaymentMethodType | null;
};
