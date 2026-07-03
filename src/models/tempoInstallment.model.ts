import type { InstallmentStatusType } from "../types/constant.type";

export interface ITempoInstallmentType {
  id: number;
  tempoId: number;
  cicilanKe: number;
  jatuhTempo: Date;
  nominal: number;
  status: InstallmentStatusType;
  tanggalLunas: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// create installment
export interface CreateInstallmentType extends Pick<
  ITempoInstallmentType,
  "cicilanKe" | "jatuhTempo" | "nominal"
> {}
