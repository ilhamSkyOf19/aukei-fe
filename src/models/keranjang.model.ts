import type { IPelangganType } from "./pelanggan.model";
import type { DetailsForCreate, ITransactionType } from "./transaction.model";

// create transaction to keranjang
export interface CreateKeranjangType extends Pick<
  ITransactionType,
  "pelangganId"
> {
  details: DetailsForCreate[];
}

// update keranjang
export interface UpdateKeranjangType extends Omit<
  CreateKeranjangType,
  "pelangganId"
> {}

// response transaction for keranjang
export interface ResponseKeranjangType extends Pick<
  ITransactionType,
  "id" | "details" | "status" | "totalBayar" | "totalDiskon" | "totalItem"
> {
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
}
