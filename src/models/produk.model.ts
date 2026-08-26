import type { MetaType, StatusPergerakan } from "../types/constant.type";
import type { IKategoriProdukType } from "./kategoriProduk.model";

export interface IProduk {
  id: number;
  nama: string;
  kategori: Pick<IKategoriProdukType, "id" | "nama" | "keterangan">;
  kode?: string | null;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  isiPerBox: number;
  stokMinimum: number;
  isActive: boolean;
  hargaModalRataRata: number;
  img: string;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateProdukType extends Pick<
  IProduk,
  "nama" | "hargaBeli" | "hargaJual" | "isiPerBox" | "stokMinimum"
> {
  kode?: string | null;
  kategoriId: number;
  img: File;
}

// update
export interface UpdateProdukType extends Partial<CreateProdukType> {}

// response
export interface ProdukResponseType extends IProduk {}

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
  kode?: string | null;
  hargaBeli: number;
  hargaModalRataRata: number;
  stok: number;
  img: string;
}

// response produk for kasir
export interface ResponseProdukForKasirType extends Pick<
  IProduk,
  | "id"
  | "nama"
  | "kode"
  | "hargaJual"
  | "stok"
  | "img"
  | "kategori"
  | "hargaModalRataRata"
> {
  hargaJualTerakhirTransaksi?: number;
}

// response for kasir with meta
export interface ResponseProdukForKasirWithMetaType {
  meta: MetaType;
  data: ResponseProdukForKasirType[];
}

export interface ResponsePantauStokWithMetaType {
  meta: MetaType;
  data: (ProdukResponseType & {
    restockTerakhir: Date | null;

    statusPergerakan: StatusPergerakan | null;
  })[];
}

export interface ResponseGetModalType {
  totalModal: number;
  totalStok: number;
}
