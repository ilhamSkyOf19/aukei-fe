import type {
  MetaType,
  PaymentMethodType,
  TempoStatusType,
  TransactionStatusType,
} from "../types/constant.type";
import type { PaginationType } from "./pagination.model";
import type { ResponseTransactionPaymentType } from "./paymentTransaction.model";
import type { IPelangganType } from "./pelanggan.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";
import type { ResponseProdukForKasirType } from "./produk.model";
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
  totalDiBayar: number | null;
  metodePembayaran: PaymentMethodType | null;
  details: Omit<ITransactionDetailType, "createdAt" | "updatedAt">[];
  tempo?: number;
  status: TransactionStatusType;
  tanggalBooking?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  paymentTransactions?: Pick<
    ResponseTransactionPaymentType,
    | "id"
    | "jenis"
    | "kasir"
    | "keterangan"
    | "metodePembayaran"
    | "nominal"
    | "createdAt"
    | "diBayar"
    | "kembalian"
  >[];
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
}

// // created transaction
export interface CreateTransactionForRequestType extends Pick<
  ITransactionType,
  "metodePembayaran" | "pelangganId"
> {
  status?: Exclude<TransactionStatusType, "CANCELLED" | "CART">;
  metodePembayaranUangDp?: Exclude<PaymentMethodType, "TEMPO">;
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
    "id" | "cicilanKe" | "jatuhTempo" | "nominal" | "status"
  >[];
}

// response
export interface ResponseTransactionType extends Omit<
  ITransactionType,
  "tempo" | "pelangganId" | "kasirId"
> {
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa" | "isActive">;
  kasir: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "isActive"
  > | null;
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
    | "tanggalBooking"
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
      | "totalPiutangTempo"
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
      | "tanggalBooking"
    > & {
      pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
      statusTempo?: TempoStatusType;
      status?: TransactionStatusType;
    })[];
  };
  meta?: MetaType;
}

export interface DetailsLocalStorageType {
  produkId: number;
  quantity: number;
  hargaJual: number;
  stokTersedia?: number;
  diskon: number;
  img: string;
  nama: string;
  kode: string;
}

export interface DataTransaksiBookingForResponseType {
  id: number;
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
  totalTransaksiBooking: number;
  totalItemBooking: number;
  status: TransactionStatusType;
}

// response tempo with pelanggan
export interface ResponseTransaksiBookingWithPelangganWithMetaType {
  data: DataTransaksiBookingForResponseType[];
  meta: MetaType;
}

export interface ResponseTransaksiBookingByPelangganType {
  data: {
    transaksi?: (Pick<
      ITransactionType,
      | "id"
      | "nomorTransaksi"
      | "totalItem"
      | "totalBayar"
      | "metodePembayaran"
      | "tanggalBooking"
      | "totalDiBayar"
    > & {
      statusTempo?: TempoStatusType;
    })[];
  };
  meta?: MetaType;
}

// response statistik transaksi booking
export interface ResponseStatistikBookingType {
  pelanggan?: Pick<IPelangganType, "id" | "nama" | "noWa" | "isActive">;
  totalBooking: number;
  totalItemBooking: number;

  estimasiOmzet: number;
  kasMasuk: number;
}

// type for produk detail item choose
export type ProdukDetailItem = Pick<
  ResponseProdukForKasirType,
  | "nama"
  | "img"
  | "hargaJual"
  | "kode"
  | "hargaJualTerakhirTransaksi"
  | "id"
  | "stok"
> & { subTotal: number; diskon: number; quantity: number };

export interface ResponseStatistikKebutuhanBarang {
  produk: {
    id: number;
    nama: string;
    kode: string;
    stokBooking: number;
    stokTersedia: number;
    totalKebutuhanStok: number;
  };
  siapKirim: boolean;
}

// statistik kebutuhan barang type
export interface StatistikKebutuhanBarangType {
  id: number;
  nama: string;
  kode: string;
  stokBooking: number;
  stokTersedia: number;
  totalKebutuhanStok: number;
  img: string;
  kategori: string;
  stokMinimum: number;
  isActive: boolean;
}
export interface ResponseStatistikKebutuhanBarangWithMetaType {
  data: StatistikKebutuhanBarangType[];
  meta: MetaType;
}

export interface ResponseStatistikKebutuhanBarangBookingType {
  totalProdukBooking: number;
  totalItemBooking: number;
  totalProdukPerluRestock: number;
  totalKebutuhanStok: number;
}
