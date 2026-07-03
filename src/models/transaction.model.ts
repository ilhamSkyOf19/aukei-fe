import type {
  MetaType,
  PaymentMethodType,
  TransactionStatusType,
} from "../types/constant.type";
import type { IPelangganType } from "./pelanggan.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";
import type { DataTempoType, ITempo } from "./tempo.model";
import type { ITempoInstallmentType } from "./tempoInstallment.model";
import type { ITransactionDetailType } from "./transactionDetail.model";

export interface ITransactionType {
  id: number;
  nomorTransaksi: string | null;
  pelangganId: number;
  kasirId: number | null;
  totalItem: number;
  totalDiskon: number;
  totalBayar: number;
  diBayar: number | null;
  metodePembayaran: PaymentMethodType | null;
  details: Omit<ITransactionDetailType, "createdAt" | "updatedAt">[];
  tempo?: number;
  status: TransactionStatusType;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DetailsForCreate extends Pick<
  ITransactionDetailType,
  "diskon" | "hargaJual" | "quantity"
> {
  produkId: number;
}

export interface DetailsLocalStorageType {
  produkId: number;
  quantity: number;
  hargaJual: number;
  diskon: number;
  img: string;
  nama: string;
  kode: string;
}

// // created transaction
export interface CreateTransactionForRequestType extends Pick<
  ITransactionType,
  "metodePembayaran" | "pelangganId"
> {
  id?: number;
  diBayar: number;
  kasirId: number;
  details: DetailsForCreate[];
  tempo?: DataTempoType;
}

export interface ResponseFieldTempo extends Pick<
  ITempo,
  "id" | "jumlahCicilan" | "totalTagihan" | "uangMuka"
> {
  installments: Pick<
    ITempoInstallmentType,
    "id" | "cicilanKe" | "jatuhTempo" | "nominal"
  >[];
}

// response
export interface ResponseTransactionType extends Omit<
  ITransactionType,
  "tempo" | "pelangganId" | "kasirId"
> {
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
  kasir: Pick<IPenggunaInternalType, "id" | "nama"> | null;
  tempo: ResponseFieldTempo | null;
}

// response with meta
export interface ResponseTransactionWithMetaType {
  meta: MetaType;
  data: ResponseTransactionType[];
}
