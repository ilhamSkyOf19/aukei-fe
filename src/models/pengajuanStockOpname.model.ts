// ============================================================
// PENGAJUAN STOCK OPNAME
// ============================================================

import type { MetaType, StatusStockOpnameType } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface IPengajuanStockOpnameType {
  id: number;

  kodeReferensi: string;

  tanggalOpname: Date;

  status: StatusStockOpnameType;

  verifiedAt: Date | null;

  alasanReject: string | null;

  createdAt: Date;

  updatedAt: Date;
}

// ============================================================
// RESPONSE PENGAJUAN STOCK OPNAME
// ============================================================

export interface ResponsePengajuanStockOpnameType extends IPengajuanStockOpnameType {
  countDetailStockOpname: number;

  adminOpname: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role" | "isActive"
  >;

  verifiedBy: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role" | "isActive"
  > | null;
}

// ============================================================
// RESPONSE PENGAJUAN WITH META
// ============================================================

export interface ResponsePengajuanStockOpnameWithMetaType {
  data: ResponsePengajuanStockOpnameType[];

  meta: MetaType;
}
