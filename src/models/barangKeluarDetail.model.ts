// ============================================================
// BARANG KELUAR DETAIL
// ============================================================

import type { IProduk } from "./produk.model";

export interface IBarangKeluarDetailType {
  id: number;

  barangKeluarId: number;

  produk: Pick<
    IProduk,
    | "id"
    | "nama"
    | "kode"
    | "kategori"
    | "img"
    | "stok"
    | "isActive"
    | "isiPerBox"
    | "hargaModalRataRata"
  >;

  jumlahStok: number;

  /**
   * Snapshot modal rata-rata produk
   * ketika barang keluar diposting.
   */
  hargaModalSatuan: number;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// CREATE
// ============================================================

export interface CreateBarangKeluarDetailType extends Pick<
  IBarangKeluarDetailType,
  "barangKeluarId" | "jumlahStok"
> {
  produkId: number;
}

// ============================================================
// UPDATE
// ============================================================

export interface UpdateBarangKeluarDetailType extends Partial<
  Omit<CreateBarangKeluarDetailType, "barangKeluarId">
> {}

// ============================================================
// RESPONSE
// ============================================================

export interface ResponseBarangKeluarDetailType extends IBarangKeluarDetailType {}

// ============================================================
// TO RESPONSE
// ============================================================

export const toResponseBarangKeluarDetail = (
  barangKeluarDetail: ResponseBarangKeluarDetailType,
): ResponseBarangKeluarDetailType => barangKeluarDetail;
