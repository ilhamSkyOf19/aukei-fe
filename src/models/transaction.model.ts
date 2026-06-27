import type {
  MetaType,
  PaymentMethodType,
  TransactionStatusType,
} from "../types/constant.type";
import type { IPelangganType } from "./pelanggan.model";
import type { ITempo } from "./tempo.model";
import type { ITransactionDetailType } from "./transactionDetail.model";

export interface ITransactionType {
  id: number;
  nomorTransaksi: string;
  pelangganId: number;
  totalItem: number;
  totalDiskon: number;
  totalBayar: number;
  metodePembayaran: PaymentMethodType;
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

// created transaction
export interface CreateTransactionForRequestType extends Pick<
  ITransactionType,
  "metodePembayaran" | "pelangganId" | "tempo"
> {
  details: DetailsForCreate[];
}

// update transaction for request
export interface UpdateTransactionForRequestType extends Partial<
  Omit<CreateTransactionForRequestType, "details">
> {
  details?: (Pick<
    ITransactionDetailType,
    "diskon" | "hargaJual" | "quantity"
  > & {
    id?: number;
    produkId: number;
  })[];
}
// response
export interface ResponseTransactionType extends Omit<
  ITransactionType,
  "tempo" | "pelangganId"
> {
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
  tempo: Pick<ITempo, "id" | "jumlahCicilan" | "totalTagihan"> | null;
}

// to response
export const toResponseTransaction = (
  transaction: ResponseTransactionType,
): ResponseTransactionType => transaction;

// response with meta
export interface ResponseTransactionWithMetaType {
  meta: MetaType;
  data: ResponseTransactionType[];
}

// to response
export const toResponseTransactionWithMeta = (
  transaction: ResponseTransactionWithMetaType,
): ResponseTransactionWithMetaType => transaction;
