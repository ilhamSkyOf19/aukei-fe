import type { ReturnStatus } from "../types/constant.type";
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

  returnTransactionId: number;

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

  createdBy?: Pick<IPenggunaInternalType, "id" | "nama" | "username">;

  tanggalReturn: Date;

  status: ReturnStatus;

  keterangan?: string | null;

  verifiedById?: number | null;

  verifiedBy?: Pick<IPenggunaInternalType, "id" | "nama" | "username"> | null;

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
