export interface ITempoPaymentType {
  id: number;
  tempoId: number;
  nominal: number;
  tanggalBayar: Date;
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}
