import type { IProduk } from "./produk.model";

export interface IBarangKeluarDetailType {
  id: number;
  barangKeluarId: number;
  produk: Omit<
    IProduk,
    | "createdAt"
    | "updatedAt"
    | "stokMinimum"
    | "hargaJual"
    | "hargaBeli"
    | "isiPerBox"
  >;
  jumlahStok: number;
  hargaModalSatuan: number;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateBarangKeluarDetailType extends Pick<
  IBarangKeluarDetailType,
  "barangKeluarId" | "jumlahStok" | "hargaModalSatuan"
> {
  produkId: number;
}

// update
export interface UpdateBarangKeluarDetailType extends Partial<
  Omit<CreateBarangKeluarDetailType, "barangKeluarId">
> {}

// response
export interface ResponseBarangKeluarDetailType extends IBarangKeluarDetailType {}
