import type { MetaType, ReturnStatus } from "../types/constant.type";
import type { IPelangganType } from "./pelanggan.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";
import type { IProduk } from "./produk.model";
import type { ITransactionType } from "./transaction.model";
import type { ITransactionDetailType } from "./transactionDetail.model";

export interface CreateReturnDetailRequestType {
  nama: string;

  kode: string;

  img: string;

  maxQuantity: number;

  hargaJual: number;

  transactionDetailId: number;

  quantityGood: number;

  quantityDamaged: number;
}

export interface CreateReturBarangForService extends Pick<
  CreateReturnRequestType,
  "customTotalRefund"
> {
  transactionId: number;
  details: Array<
    Pick<
      CreateReturnDetailRequestType,
      "quantityDamaged" | "quantityGood" | "transactionDetailId"
    >
  >;
}

export interface IReturnDetailType {
  id: number;

  transactionDetailId: number;

  transactionDetail?: Pick<
    ITransactionDetailType,
    "id" | "quantity" | "hargaJual" | "subtotal" | "diskon"
  > & {
    produkId: number;
  };

  quantityReturn: number;

  quantityGood: number;

  quantityDamaged: number;

  totalRefund: number;

  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateReturnRequestType {
  customTotalRefund?: number;
  details: CreateReturnDetailRequestType[];
}

export interface IReturnTransactionType {
  id: number;

  kodeReferensi: string;

  transactionId: number;

  totalRefundAll: number;

  transaction?: Pick<
    ITransactionType,
    | "id"
    | "nomorTransaksi"
    | "pelangganId"
    | "totalBayar"
    | "status"
    | "completedAt"
  >;

  createdById: number;

  createdBy?: Pick<IPenggunaInternalType, "id" | "nama" | "username" | "role">;

  tanggalReturn: Date;

  status: ReturnStatus;

  keterangan?: string | null;

  verifiedById?: number | null;

  verifiedBy?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role"
  > | null;

  verifiedAt?: Date | null;

  details?: IReturnDetailType[];

  createdAt: Date;

  updatedAt: Date;
}

export type ResponseReturnDetailType = Pick<
  IReturnTransactionType,
  | "id"
  | "kodeReferensi"
  | "transactionId"
  | "status"
  | "createdById"
  | "verifiedById"
  | "createdAt"
> & {
  totalRefundAll: number;
  details: Array<
    Pick<
      IReturnDetailType,
      | "id"
      | "quantityGood"
      | "quantityDamaged"
      | "quantityReturn"
      | "totalRefund"
    > & {
      transactionDetail: Pick<
        ITransactionDetailType,
        "id" | "quantity" | "hargaJual" | "subtotal"
      > & {
        produk: Pick<IProduk, "id" | "kode" | "nama" | "hargaBeli">;
      };
    }
  >;
};

export interface ResponseRegularReturnTransactionType {
  id: number;
  kodeReferensi: string;
  transactionId: number;
  createdBy: Pick<IPenggunaInternalType, "id" | "nama" | "role">;
  tanggalReturn: Date;
  status: ReturnStatus;
  keterangan?: string | null;
  totalRefundAll: number;
  verifiedBy?: Pick<IPenggunaInternalType, "id" | "nama" | "role"> | null;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// response with meta
export interface ResponseRegularReturnTransactionWithMetaType {
  data: Array<ResponseRegularReturnTransactionType>;
  meta: MetaType;
}

export type ResponseReturnForByIdType = Pick<
  IReturnTransactionType,
  | "id"
  | "createdBy"
  | "keterangan"
  | "kodeReferensi"
  | "status"
  | "tanggalReturn"
  | "verifiedBy"
  | "verifiedAt"
  | "totalRefundAll"
> & {
  returDetails: Omit<IReturnDetailType, "transactionDetail">[];
  transaction: Pick<
    ITransactionType,
    "id" | "nomorTransaksi" | "status" | "completedAt"
  > & {
    details: Array<
      Pick<
        ITransactionDetailType,
        | "id"
        | "hargaJual"
        | "produk"
        | "totalRetur"
        | "diskon"
        | "quantity"
        | "subtotal"
      >
    >;
    pelanggan: Pick<IPelangganType, "id" | "noWa" | "nama" | "isActive">;
  };
};

export interface ResponseUpdateStatusReturnTransactionType extends Pick<
  IReturnTransactionType,
  "id" | "status" | "kodeReferensi"
> {
  tanggalDiAjukan: Date;
}
