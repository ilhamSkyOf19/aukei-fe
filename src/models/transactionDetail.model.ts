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
