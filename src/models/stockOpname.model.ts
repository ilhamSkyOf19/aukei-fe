// ==================================================
// STOCK OPNAME
// ==================================================

import type { MetaType, StatusStockOpnameType } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";
import type { ResponseRiwayatStockOpnameType } from "./riwayatStockOpname.model";
import type { ResponseStockOpnameDetailType } from "./stockOpnameDetail.model";

export interface IStockOpnameType {
  id: number;

  kodeReferensi: string;

  tanggalOpname: Date;

  keterangan: string | null;

  status: StatusStockOpnameType;

  adminOpnameId: number;

  verifiedById: number | null;

  verifiedAt: Date | null;

  alasanReject: string | null;

  createdAt: Date;

  updatedAt: Date;
}

// ==================================================
// RESPONSE STOCK OPNAME
// ==================================================

export interface ResponseStockOpnameType extends Omit<
  IStockOpnameType,
  "adminOpnameId" | "verifiedById"
> {
  adminOpname: Pick<IPenggunaInternalType, "id" | "nama" | "username">;

  verifiedBy: Pick<IPenggunaInternalType, "id" | "nama" | "username"> | null;
}

export interface UpdateStockOpnameType {
  tanggalOpname?: Date;

  keterangan?: string;

  status?: StatusStockOpnameType;
}

export interface ResponseStockOpnameWithMetaType {
  data: ResponseStockOpnameType[];

  statistik: {
    totalSurplusBersih: number;

    totalKerugianStockOpname: number;

    totalNilaiSurplusStockOpname: number;

    kerugianStockOpnameBersih: number;
  };

  meta: MetaType;
}

// ==================================================
// CREATE STOCK OPNAME FOR REQUEST
// ==================================================

export interface CreateStockOpnameForRequestType {
  tanggalOpname: string;

  keterangan?: string;
}

// ==================================================
// UPDATE STOCK OPNAME FOR REQUEST
// ==================================================

export interface UpdateStockOpnameForRequestType {
  tanggalOpname?: string;

  keterangan?: string;
}

// ==================================================
// RESPONSE STATUS STOCK OPNAME
// ==================================================

export interface ResponseStatusStockOpnameType {
  status: StatusStockOpnameType;
}

export interface ResponseStockOpnameWithDetailType extends ResponseStockOpnameType {
  adminOpname: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role" | "isActive"
  >;

  verifiedBy: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role" | "isActive"
  > | null;

  details: ResponseStockOpnameDetailType[];

  riwayat: ResponseRiwayatStockOpnameType[];
}
