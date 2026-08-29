// ==================================================
// STOCK OPNAME DETAIL
// ==================================================

import type {
  JenisPenyesuaianStockOpnameType,
  StatusDetailStockOpnameType,
} from "../types/constant.type";
import type { IProduk } from "./produk.model";

export interface IStockOpnameDetailType {
  id: number;

  stockOpnameId: number;

  produkId: number;

  stokSistem: number;

  stokFisik: number | null;

  selisih: number | null;

  status: StatusDetailStockOpnameType;

  jenisPenyesuaian: JenisPenyesuaianStockOpnameType | null;

  hargaModalSatuan: number | null;

  totalKerugian: number;

  keteranganPenyesuaian: string | null;

  createdAt: Date;

  updatedAt: Date;
}
// ==================================================
// CREATE STOCK OPNAME DETAIL
// ==================================================

export interface CreateStockOpnameDetailType {
  stockOpnameId: number;

  produkId: number;

  stokFisik: number;
}

// ==================================================
// UPDATE STOCK OPNAME DETAIL
// ==================================================

export interface UpdateStockOpnameDetailType {
  produkId?: number;

  stokFisik?: number;
}

// ==================================================
// RESPONSE STOCK OPNAME DETAIL
// ==================================================

export interface ResponseStockOpnameDetailType extends Omit<
  IStockOpnameDetailType,
  "produkId"
> {
  produk: Pick<IProduk, "id" | "kode" | "nama">;
}

// ==================================================
// FIND STOCK OPNAME DETAIL
// ==================================================

export interface FindStockOpnameDetailType {
  id: number;
}
