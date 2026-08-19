import {
  type JenisNotifikasiProdukType,
  type MetaType,
} from "../types/constant.type";
import type { IProduk } from "./produk.model";

export interface INotifikasiProdukType {
  id: number;
  produk: Pick<IProduk, "id" | "nama" | "kode" | "img" | "kategori" | "stok">;
  jenisNotifikasiProduk: JenisNotifikasiProdukType;
  createdAt: Date;
  updatedAt: Date;
}

// response
export interface ResponseNotifikasiProdukWithMetaType {
  data: INotifikasiProdukType[];
  meta: MetaType;
}
