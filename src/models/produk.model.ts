import type { MetaType } from "../types/constant.type";
import type { IKategoriProdukType } from "./kategoriProduk.model";

export interface IProduk {
  id: number;
  nama: string;
  kategori: Pick<IKategoriProdukType, "id" | "nama" | "keterangan">;
  kode: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  isiPerBox: number;
  stokMinimum: number;
  isActive: boolean;
  img: string;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateProdukType extends Pick<
  IProduk,
  | "nama"
  | "kode"
  | "hargaBeli"
  | "hargaJual"
  | "stok"
  | "isiPerBox"
  | "stokMinimum"
> {
  kategoriId: number;
  img: File;
}

// update
export interface UpdateProdukType extends Partial<CreateProdukType> {}

// response
export interface ProdukResponseType extends IProduk {}

// to response
export const toProdukResponse = (
  produk: ProdukResponseType,
): ProdukResponseType => produk;

// response with meta
export interface ResponseProdukWithMetaType {
  meta: MetaType;
  data: ProdukResponseType[];
}

// update status
export interface UpdateStatusType {
  status: boolean;
}

export interface ResponseProdukForChooseType {
  id: number;
  nama: string;
  kode: string;
  hargaBeli: number;
  img: string;
}
