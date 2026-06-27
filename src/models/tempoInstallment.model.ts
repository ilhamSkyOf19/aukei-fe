import type { InstallmentStatusType } from "../types/constant.type";

export interface ITempoInstallmentType {
  id: number;
  tempoId: number;
  cicilanKe: number;
  jatuhTempo: Date;
  nominal: number;
  statsus: InstallmentStatusType;
  tanggalLunas: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
