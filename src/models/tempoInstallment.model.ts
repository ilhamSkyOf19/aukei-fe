import type { InstallmentStatusType, MetaType } from "../types/constant.type";
import type {
  ITempoPaymentType,
  ResponseTempoPaymentType,
} from "./tempoPayment.model";

export interface ITempoInstallmentType {
  id: number;
  tempoId: number;
  cicilanKe: number;
  jatuhTempo: Date;
  nominal: number;
  status: InstallmentStatusType;
  payments: Omit<ITempoPaymentType, "tempoId" | "metodePembayaran">[];
  tanggalLunas: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// create installment
export interface CreateInstallmentType extends Pick<
  ITempoInstallmentType,
  "cicilanKe" | "jatuhTempo" | "nominal" | "status"
> {}

export interface ResponseHistoryPaymentWithMetaType {
  data: {
    cicilanKe: number;
    status: InstallmentStatusType;
    payments: Pick<
      ResponseTempoPaymentType,
      | "id"
      | "nominal"
      | "tanggalBayar"
      | "keterangan"
      | "metodePembayaran"
      | "kasir"
    >[];
  };
  meta: MetaType;
}
