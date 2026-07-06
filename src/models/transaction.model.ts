import type {
  MetaType,
  PaymentMethodType,
  TempoStatusType,
  TransactionStatusType,
} from "../types/constant.type";
import type { PaginationType } from "./pagination.model";
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

export interface QueryRiwayatTransactionType extends PaginationType {
  startDate?: string;
  endDate?: string;
  metodePembayaran?: string;
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
  "id" | "jumlahCicilan" | "totalTagihan" | "uangMuka" | "tenor"
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

export interface ResponseRingkasanStatistikType {
  totalTransaksi: number;
  totalOmzet: number;
  totalRataRataTransaksi: number;
  totalModal: number;
  totalLaba: number;
  totalPiutang: number;
  totalProdukTerjual: number;
  totalItemTerjual: number;
  totalKerugian: number;
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
    statusTempo?: TempoStatusType;
    status?: TransactionStatusType;
  })[];
  meta: MetaType;
}

export interface ResponseStatistikWithPersentaseType {
  totalTransaksi: {
    total: number;
    persentase: number;
  };
  totalOmzet: {
    total: number;
    persentase: number;
  };
  totalRataRataTransaksi: {
    total: number;
    persentase: number;
  };
  totalModal: {
    total: number;
    persentase: number;
  };
  totalLaba: {
    total: number;
    persentase: number;
  };
  totalPiutang: {
    total: number;
    persentase: number;
  };
  totalProdukTerjual: {
    total: number;
    persentase: number;
  };
  totalItemTerjual: {
    total: number;
    persentase: number;
  };
  totalKerugian: {
    total: number;
    persentase: number;
  };
}

export interface ChartBucketType {
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface ResponseChartType {
  date: string;
  value: number;
}
