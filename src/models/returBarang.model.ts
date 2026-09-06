import type { MetaType, ReturnStatus } from "../types/constant.type";
import type { IPelangganType } from "./pelanggan.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";
import type { IProduk } from "./produk.model";
import type { ITransactionType } from "./transaction.model";
import type { ITransactionDetailType } from "./transactionDetail.model";

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

interface IReturnDetailType {
  id: number;

  transactionDetailId: number;

  transactionDetail?: Pick<
    ITransactionDetailType,
    "id" | "quantity" | "hargaJual" | "subtotal" | "diskon" | "hpp"
  > & {
    produkId: number;
  };

  /**
   * Snapshot HPP/modal barang pada saat retur.
   *
   * Pada sistem non-FIFO, nilai ini diambil dari
   * TransactionDetail.hpp.
   */
  hargaBeliRetur: number;

  quantityReturn: number;

  totalRefund: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReturnDetailRequestType {
  transactionDetailId: number;

  quantityGood: number;

  quantityDamaged: number;
}

export interface ResponseDataReturBarangDetailType {
  id: number;

  customTotalRefund: number;

  kodeReferensi: string;

  keterangan: string | null;

  details: Array<
    Pick<
      IReturnDetailType,
      | "id"
      | "quantityReturn"
      | "totalRefund"
      | "transactionDetailId"
      | "hargaBeliRetur"
    >
  >;
}

export interface UpdateReturnDetailParamsType {
  returnTransactionId: number;
  returnDetailId: number;
}

export interface UpdateReturnRequestType {
  keterangan?: string;

  customTotalRefund?: number;

  details: Array<
    CreateReturnDetailRequestType & {
      hargaJual: number;
    }
  >;
}

export interface AddReturnDetailRequestType {
  transactionId: number;
  transactionDetailId: number;
}

export interface AddReturnDetailByIdRequestType {
  returnId?: number | null;

  transactionId: number;

  transactionDetailId: number;
}

export interface AddReturnDetailResponseType {
  returnTransactionId: number;
  returnDetailId: number;
  kodeReferensi: string;

  transactionDetail: {
    id: number;
    produkId: number;
    namaProduk: string;
    kodeProduk?: string | null;
    quantity: number;
    quantityAlreadyReturned: number;
    quantityAvailableToReturn: number;
    quantityReturn: number;
    hargaJual: number;
    totalRefund: number;
  };
}

export interface DeleteReturnDetailParamsType {
  returnTransactionId: number;
  returnDetailId: number;
}

export interface UpdateReturnDetailRequestType {
  hargaBeliRetur: number;
  quantityReturn: number;
  totalRefund: number;
}

export interface UpdateReturnDetailResponseType {
  returnTransactionId: number;
  returnDetailId: number;

  hargaBeliRetur: number;
  quantityReturn: number;
  totalRefund: number;

  hargaJual: number;

  quantityTransaction: number;
  quantityAlreadyReturned: number;
  quantityAvailableToReturn: number;
}

export type ResponsePengajuanReturnType = {
  id: number;
  kodeReferensi: string;
  status: ReturnStatus;
};

/**
 * ============================================================
 * FIND ALL RETURN
 * ============================================================
 */

export interface ResponseFindAllReturnType {
  data: ResponseDataFindAllReturnType[];

  meta: MetaType;
}

export type ResponseDataFindAllReturnType = Pick<
  IReturnTransactionType,
  | "id"
  | "kodeReferensi"
  | "transactionId"
  | "status"
  | "totalRefundAll"
  | "tanggalReturn"
  | "createdAt"
  | "updatedAt"
> & {
  createdBy: Pick<IPenggunaInternalType, "id" | "nama" | "role">;

  verifiedBy: Pick<IPenggunaInternalType, "id" | "nama" | "role">;

  verifiedAt: Date | null;

  transaction: Pick<ITransactionType, "id" | "nomorTransaksi">;

  details: ResponseDataFindAllReturnDetailType[];
};

export type ResponseDataFindAllReturnDetailType = Pick<
  IReturnDetailType,
  | "id"
  | "transactionDetailId"
  | "quantityReturn"
  | "hargaBeliRetur"
  | "totalRefund"
> & {
  transactionDetail: Pick<
    ITransactionDetailType,
    "id" | "quantity" | "hargaJual"
  > & {
    produk: Pick<IProduk, "id" | "kode" | "nama">;
  };
};

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
        | "totalHarga"
        | "hpp"
      >
    >;

    pelanggan: Pick<IPelangganType, "id" | "noWa" | "nama" | "isActive">;
  };
};
