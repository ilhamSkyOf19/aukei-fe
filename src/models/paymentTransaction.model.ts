import type {
  PaymentMethodType,
  TransactionPaymentStatusType,
} from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface ResponseTransactionPaymentType {
  id: number;

  transactionId: number;

  kasir: Pick<IPenggunaInternalType, "id" | "nama">;

  metodePembayaran: PaymentMethodType;

  jenis: TransactionPaymentStatusType;

  nominal: number;

  diBayar: number;

  kembalian: number;

  keterangan?: string | null;

  createdAt: Date;
  updatedAt: Date;
}
