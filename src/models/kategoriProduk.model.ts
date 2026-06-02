import type { MetaType } from "../types/constant.type";

export interface IKategoriProdukType {
  id: number;
  nama: string;
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateKategoriProdukType extends Pick<
  IKategoriProdukType,
  "nama"
> {
  keterangan?: string;
}

// update
export interface UpdateKategoriProdukType extends Partial<CreateKategoriProdukType> {}

// response
export interface ResponseKategoriProdukType extends IKategoriProdukType {}

// to response
export const toKategoriProdukResponse = (
  kategoriProduk: IKategoriProdukType,
): ResponseKategoriProdukType => kategoriProduk;

// response with meta
export interface ResponseKategoriProdukWithMetaType {
  meta: MetaType;
  data: ResponseKategoriProdukType[];
}
