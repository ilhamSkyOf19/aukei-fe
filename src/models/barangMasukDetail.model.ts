// models/barangMasukDetail.model.ts

import type { IProduk } from "./produk.model";

// ============================================================
// BARANG MASUK DETAIL
// ============================================================

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
    | "hargaModalRataRata"
  >;

  jumlahBox: number;

  // Quantity dihitung dari:
  // jumlahBox × isiPerBox
  //
  // Field ini bukan lagi field database.
  // Jika masih diperlukan untuk response/frontend,
  // jadikan computed value di mapping response.
  jumlahStok: number;

  hargaBeli: number;

  isiPerBox: number;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// CREATE
// ============================================================

export interface CreateBarangMasukDetailType extends Pick<
  IBarangMasukDetailType,
  "barangMasukId"
> {
  hargaBeli?: number;

  jumlahBox?: number;

  jumlahStok?: number;

  produkId: number[];
}

// ============================================================
// UPDATE
// ============================================================

export interface UpdateBarangMasukDetailType extends Partial<
  Omit<CreateBarangMasukDetailType, "barangMasukId" | "produkId">
> {
  produkId?: number;
}

// ============================================================
// RESPONSE
// ============================================================

export interface ResponseBarangMasukDetailType extends IBarangMasukDetailType {}

// ============================================================
// TO RESPONSE
// ============================================================

export const toResponseBarangMasukDetail = (
  barangMasukDetail: ResponseBarangMasukDetailType,
): ResponseBarangMasukDetailType => barangMasukDetail;
