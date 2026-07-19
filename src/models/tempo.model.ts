import type { TempoStatusType } from "../types/constant.type";
import type {
  CreateInstallmentType,
  ITempoInstallmentType,
} from "./tempoInstallment.model";
import type { ITempoPaymentType } from "./tempoPayment.model";

export interface ITempo {
  id: number;
  transactionId: number;
  totalTagihan: number;
  uangMuka: number;
  tenor: number;
  periode: number;
  status: TempoStatusType;
  installments: Omit<ITempoInstallmentType, "tempoId">[];
  payments: Omit<ITempoPaymentType, "tempoId">[];
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateTempoType extends Pick<
  ITempo,
  "uangMuka" | "tenor" | "periode"
> {
  startDate?: string;
}

// data tempo
export interface DataTempoType extends CreateTempoType {
  installments: CreateInstallmentType[];
}
