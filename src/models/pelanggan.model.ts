import type { MetaType } from "../types/constant.type";

export interface IPelangganType {
  id: number;
  nama: string;
  noWa: string;
  isActive: boolean;
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

// response pelanggan with riwayat
export interface ResponsePelangganWithRiwayatAndMetaType {
  data: (IPelangganType & {
    totalTransaction?: number;
    booking?: number;
    kredit?: {
      berjalan: number;
      selesai: number;
      terlambat: number;
    };
  })[];
  meta: MetaType;
}
