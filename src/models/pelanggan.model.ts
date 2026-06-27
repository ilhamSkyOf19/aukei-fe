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
