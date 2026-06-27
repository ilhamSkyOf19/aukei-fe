import type { IProduk } from "./produk.model";

export interface ITransactionDetailType {
  id: number;
  produk: Pick<IProduk, "id" | "nama" | "kode" | "img">;
  quantity: number;
  totalHarga: number;
  hargaJual: number;
  diskon: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

// request detail for service
export interface CreateTransactionDetailForServiceType extends Omit<
  ITransactionDetailType,
  "id" | "createdAt" | "updatedAt" | "produk"
> {
  produkId: number;
  namaProduk: string;
  kodeProduk: string;
}

// response detail for service
export interface ResponseTransactionDetailType extends Omit<
  ITransactionDetailType,
  "createdAt" | "updatedAt"
> {}

export const toResponseTransactionDetail = (
  transactionDetail: ResponseTransactionDetailType,
): ResponseTransactionDetailType => transactionDetail;
