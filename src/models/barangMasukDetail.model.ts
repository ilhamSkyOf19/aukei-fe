import type { IProduk } from "./produk.model";

export interface IBarangMasukDetailType {
  id: number;
  barangMasukId: number;
  produk: Omit<
    IProduk,
    "createdAt" | "updatedAt" | "stokMinimum" | "hargaJual"
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
  produkId: number;
}

// update
export interface UpdateBarangMasukDetailType extends Partial<
  Omit<CreateBarangMasukDetailType, "barangMasukId">
> {}

// response
export interface ResponseBarangMasukDetailType extends IBarangMasukDetailType {}
