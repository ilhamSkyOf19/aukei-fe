import type { MetaType } from "../types/constant.type";

export interface IPelangganType {
  id: number;
  nama: string;
  noWa: string;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreatePelangganType extends Pick<
  IPelangganType,
  "nama" | "noWa"
> {}

// update
export interface UpdatePelangganType extends Partial<CreatePelangganType> {}

// response
export interface ResponsePelangganType extends IPelangganType {}

// to response
export const toResponsePelanggan = (
  pelanggan: IPelangganType,
): ResponsePelangganType => pelanggan;

// response with meta
export interface ResponsePelangganWithMetaType {
  data: ResponsePelangganType[];
  meta: MetaType;
}

// response for keranjang
export interface ResponsePelangganForKeranjangType extends Pick<
  IPelangganType,
  "id" | "nama" | "noWa"
> {
  totalItem: number;
  updatedAtCart: Date;
}

// response for keranjang with meta
export interface ResponsePelangganForKeranjangWithMetaType {
  data: ResponsePelangganForKeranjangType[];
  meta: MetaType;
}

// to response for keranjang
export const toResponsePelangganForKeranjang = (
  pelanggan: ResponsePelangganForKeranjangType,
): ResponsePelangganForKeranjangType => ({
  ...pelanggan,
});
