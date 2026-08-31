// ============================================================
// RIWAYAT STOCK OPNAME
// ============================================================

import type { MetaType, StatusStockOpnameType } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface IRiwayatStockOpnameType {
  id: number;

  stockOpnameId: number;

  authorId: number;

  status: StatusStockOpnameType;

  keterangan: string | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface ResponseRiwayatStockOpnameType {
  id: number;

  stockOpnameId: number;

  status: StatusStockOpnameType;

  keterangan: string;

  createdAt: Date;

  updatedAt: Date;

  author: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role" | "isActive"
  >;
}

// ============================================================
// CREATE RIWAYAT STOCK OPNAME
// ============================================================

export interface CreateRiwayatStockOpnameType {
  stockOpnameId: number;

  authorId: number;

  status: StatusStockOpnameType;

  keterangan?: string | null;
}

// ============================================================
// RESPONSE RIWAYAT STOCK OPNAME
// ============================================================

export interface ResponseRiwayatStockOpnameType extends IRiwayatStockOpnameType {
  author: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role" | "isActive"
  >;
}

// ============================================================
// RESPONSE RIWAYAT WITH META
// ============================================================

export interface ResponseRiwayatStockOpnameWithMetaType {
  data: ResponseRiwayatStockOpnameType[];

  meta: MetaType;
}

// ============================================================
// RESPONSE RIWAYAT STOCK OPNAME FOR NOTIFIKASI
// ============================================================

export interface ResponseRiwayatStockOpnameForNotifikasiType {
  id: number;

  stockOpnameId: number;

  kodeReferensi: string;

  status: StatusStockOpnameType;

  keterangan: string;

  createdAt: Date;

  updatedAt: Date;

  author: Pick<IPenggunaInternalType, "id" | "nama" | "role">;
}

// ============================================================
// RESPONSE RIWAYAT STOCK OPNAME FOR HIGHLIGHT
// ============================================================

export interface ResponseRiwayatStockOpnameForHighlightType {
  id: number;

  stockOpnameId: number;

  kodeReferensi: string;

  status: StatusStockOpnameType;

  keterangan: string;

  createdAt: Date;

  updatedAt: Date;

  author: Pick<IPenggunaInternalType, "id" | "nama" | "role">;
}

// ============================================================
// RESPONSE NOTIFIKASI WITH META
// ============================================================

export interface ResponseRiwayatStockOpnameForNotifikasiWithMetaType {
  data: ResponseRiwayatStockOpnameForNotifikasiType[];

  meta: MetaType;
}
