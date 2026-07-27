import type { PaymentMethodType } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface ITempoPaymentType {
  id: number;
  installmentId: number;
  nominal: number;
  tanggalBayar: Date;
  metodePembayaran: Exclude<PaymentMethodType, "TEMPO">;
  kasir: Pick<IPenggunaInternalType, "id" | "nama">;
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTempoPaymentType extends Pick<
  ITempoPaymentType,
  "nominal" | "installmentId" | "metodePembayaran"
> {
  keterangan?: string;
}

// response
export interface ResponseTempoPaymentType extends ITempoPaymentType {}
