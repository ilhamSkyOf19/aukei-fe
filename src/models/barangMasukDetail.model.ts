import type { IProduk } from "./produk.model";

export interface IBarangMasukDetailType {
  id: number;
  barangMasukId: number;
  produk: Pick<
    IProduk,
    | "nama"
    | "kode"
    | "kategori"
    | "img"
    | "hargaBeli"
    | "isiPerBox"
    | "id"
    | "stok"
  >;
  jumlahBox: number;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateBarangMasukDetailType extends Pick<
  IBarangMasukDetailType,
  "barangMasukId" | "jumlahBox"
> {
  produkId: number[];
}

// update
export interface UpdateBarangMasukDetailType extends Partial<
  Omit<CreateBarangMasukDetailType, "barangMasukId" | "produkId">
> {
  produkId?: number;
}

// response
export interface ResponseBarangMasukDetailType extends IBarangMasukDetailType {}
