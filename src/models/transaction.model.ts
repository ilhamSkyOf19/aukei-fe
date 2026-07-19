import type {
  MetaType,
  PaymentMethodType,
  TempoStatusType,
  TransactionStatusType,
} from "../types/constant.type";
import type { PaginationType } from "./pagination.model";
import type { IPelangganType } from "./pelanggan.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";
import type { ResponseRingkasanStatistikType } from "./statistik.model";
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

export interface QueryRiwayatTransactionType extends PaginationType {
  startDate?: string;
  endDate?: string;
  metodePembayaran?: string;
  statusTempo?: string;
}

export interface DetailsForCreate extends Pick<
  ITransactionDetailType,
  "diskon" | "hargaJual" | "quantity"
> {
  produkId: number;
  quantityDelivered?: number;
}

// // created transaction
export interface CreateTransactionForRequestType extends Pick<
  ITransactionType,
  "metodePembayaran" | "pelangganId"
> {
  status?: Exclude<TransactionStatusType, "COMPLETED" | "CANCELLED" | "CART">;
  id?: number;
  diBayar: number;
  kembalian: number;
  kasirId: number;
  details: DetailsForCreate[];
  tempo?: DataTempoType;
}

export interface ResponseFieldTempo extends Pick<
  ITempo,
  "id" | "periode" | "totalTagihan" | "uangMuka" | "jumlahCicilan" | "status"
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

export interface ResponseRiwayatTransactionType {
  data: (Pick<
    ITransactionType,
    | "id"
    | "nomorTransaksi"
    | "completedAt"
    | "totalItem"
    | "totalBayar"
    | "metodePembayaran"
  > & {
    pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
    kasir: Pick<IPenggunaInternalType, "id" | "nama" | "username"> | null;
    statusTempo?: TempoStatusType;
    status?: TransactionStatusType;
  })[];
  meta: MetaType;
}

export interface ResponseRiwayatTransaksiPelangganType {
  data: {
    pelanggan: {
      id: number;
      nama: string;
      noWa: string;
      isActive: boolean;
    };
    statistik?: Pick<
      ResponseRingkasanStatistikType,
      | "totalTransaksi"
      | "totalOmzet"
      | "totalRataRataTransaksi"
      | "totalPiutang"
      | "totalProdukTerjual"
      | "totalItemTerjual"
    >;
    transaksi?: (Pick<
      ITransactionType,
      | "id"
      | "nomorTransaksi"
      | "completedAt"
      | "totalItem"
      | "totalBayar"
      | "metodePembayaran"
    > & {
      pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
      statusTempo?: TempoStatusType;
      status?: TransactionStatusType;
    })[];
  };
  meta: MetaType;
}

export interface DetailsLocalStorageType {
  produkId: number;
  quantity: number;
  hargaJual: number;
  stokTersedia: number;
  diskon: number;
  img: string;
  nama: string;
  kode: string;
  stokDikirim?: number;
}
