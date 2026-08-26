// models/barangMasuk.model.ts

import type { MetaType, StatusInventoriType } from "../types/constant.type";
import type { IBarangMasukDetailType } from "./barangMasukDetail.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface IBarangMasukType {
  id: number;
  kodeReferensi: string;
  tanggalMasuk: Date;
  keterangan: string | null;
  status: StatusInventoriType;

  detailBarangMasuks: Omit<IBarangMasukDetailType, "barangMasukId">[];

  totalNilai: number;

  postedAt?: Date | null;

  author?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "isActive"
  > | null;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// CREATE REQUEST
// ============================================================

export interface CreateBarangMasukForRequestType {
  tanggalMasuk: string;
  keterangan?: string;
}

// ============================================================
// UPDATE REQUEST
// ============================================================

export interface UpdateBarangMasukForRequestType extends Partial<CreateBarangMasukForRequestType> {}

// ============================================================
// CREATE SERVICE
// ============================================================

export interface CreateBarangMasukType extends Pick<
  IBarangMasukType,
  "tanggalMasuk"
> {
  keterangan?: string;
  kodeReferensi?: string;
}

// ============================================================
// UPDATE SERVICE
// ============================================================

export interface UpdateBarangMasukType extends Partial<
  Omit<CreateBarangMasukType, "kodeReferensi">
> {}

// ============================================================
// RESPONSE
// ============================================================

export interface ResponseBarangMasukType extends Omit<
  IBarangMasukType,
  "detailBarangMasuks" | "totalNilai"
> {
  totalNilai: number;
}

// ============================================================
// RESPONSE WITH META
// ============================================================

export interface ResponseBarangMasukWithMetaType {
  data: Array<
    ResponseBarangMasukType & {
      countDetailBarangMasuk: number;
      tanggalDiajukan?: Date | null;
    }
  >;

  meta: MetaType;
}

// ============================================================
// RESPONSE WITH DETAIL
// ============================================================

export interface ResponseBarangMasukWithDetailType extends ResponseBarangMasukType {
  detailBarangMasuks: Array<
    Omit<IBarangMasukDetailType, "barangMasukId"> & {
      stokMinimum?: number;
    }
  >;

  ownerAuthor?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role"
  > | null;

  tanggalDiajukan?: Date | null;
}

// ============================================================
// POSTED SERVICE
// ============================================================
//
// Tidak lagi menerima:
// - barangMasukDetails
// - jumlahStok
// - sisaStok
// - stok dari request
// - hargaBeliTerakhir dari request
//
// Semua data costing dan stok diambil dari database oleh service.
//
// Status tetap dikirim karena merupakan bagian dari lifecycle
// BarangMasuk.
//
// ============================================================

export interface PostedBarangMasukForServiceType {
  barangMasukId: number;
  status: StatusInventoriType;
}
