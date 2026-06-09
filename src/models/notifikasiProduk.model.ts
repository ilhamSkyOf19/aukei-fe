import { type JenisNotifikasiProdukType } from "../types/constant.type";
import type { IProduk } from "./produk.model";

export interface INotifikasiProdukType {
  id: number;
  produk: Pick<IProduk, "id" | "nama" | "kode" | "img">;
  jenisNotifikasiProduk: JenisNotifikasiProdukType;
  createdAt: Date;
  updatedAt: Date;
}

// create notifikasi
export interface PushNotifikasiProdukType {
  produkId: number;
  stokCurrent: number;
  stokMinimum: number;
}

// response
export interface ResponseNotifikasiProdukType extends INotifikasiProdukType {}

// to response
export const toResponseNotifikasiProdukType = (
  notifikasi: ResponseNotifikasiProdukType,
): ResponseNotifikasiProdukType => notifikasi;
