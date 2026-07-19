import type { MetaType, TempoStatusType } from "../types/constant.type";
import type { IPelangganType } from "./pelanggan.model";
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
  jumlahCicilan: number;
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
  "uangMuka" | "jumlahCicilan" | "periode"
> {
  startDate?: string;
}

// data tempo
export interface DataTempoType extends CreateTempoType {
  installments: CreateInstallmentType[];
}

export interface DataTempoForResponseType {
  id: number;
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
  totalTransaksiTempo: number;
  tagihanBelumLunas: number;
  tagihanLunas: number;
  jatuhTempoTerdekat: Date | undefined;
  status: TempoStatusType;
}

// response tempo with pelanggan
export interface ResponseTempoWithPelangganWithMetaType {
  data: DataTempoForResponseType[];
  meta: MetaType;
}

// response statistik
export interface ResponseStatistikTempo {
  totalPelanggan: number;
  totalTagihanBelumSelesai: number;
  totalTagihanSelesai: number;
  totalTransaksiKredit: number;
  totalTagihanJatuhTempo: number;
}
