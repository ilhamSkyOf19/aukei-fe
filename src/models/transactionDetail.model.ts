import type { IProduk } from "./produk.model";

export interface ITransactionDetailType {
  id: number;
  produk: Pick<
    IProduk,
    "id" | "nama" | "kode" | "img" | "hargaModalRataRata" | "hargaPpn"
  >;
  quantity: number;
  totalHarga: number;
  hargaJual: number;
  diskon: number;
  subtotal: number;
  hpp: number | null;
  laba: number | null;
  totalRetur: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseTransactionDetailType extends Omit<
  ITransactionDetailType,
  "createdAt" | "updatedAt"
> {}

export interface UpdateHargaAndDiskonForRequestType {
  hargaJual?: number;
  diskon?: number;
}
