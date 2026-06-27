import type { TempoStatusType } from "../types/constant.type";
import type { ITempoInstallmentType } from "./TempoInstallment.model";
import type { ITempoPaymentType } from "./tempoPayment.model";

export interface ITempo {
  id: number;
  transactionId: number;
  totalTagihan: number;
  jumlahCicilan: number;
  status: TempoStatusType;
  installments: Omit<ITempoInstallmentType, "tempoId">[];
  payments: Omit<ITempoPaymentType, "tempoId">[];
  createdAt: Date;
  updatedAt: Date;
}
