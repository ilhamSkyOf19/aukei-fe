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

export type CreateStockOpnameDetailItemType = {
  produkId: number;
  stokFisik: number;
  selisih: number;
  jenisPenyesuaian?: JenisPenyesuaianStockOpnameType;
  keteranganPenyesuaian?: string;
};

export type CreateStockOpnameDetailArrayType = {
  stockOpnameId: number;
  details: CreateStockOpnameDetailItemType[];
};

export type CreateStockOpnameDetailArrayForServiceType = {
  stockOpnameId: number;
  details: Pick<
    CreateStockOpnameDetailItemType,
    "stokFisik" | "jenisPenyesuaian" | "keteranganPenyesuaian" | "produkId"
  >[];
};

export interface UpdateStockOpnameDetailType {
  produkId?: number;

  stokFisik?: number;

  jenisPenyesuaian?: JenisPenyesuaianStockOpnameType;

  keteranganPenyesuaian?: string;
}

// ==================================================
// RESPONSE STOCK OPNAME DETAIL
// ==================================================

export interface ResponseStockOpnameDetailType extends Omit<
  IStockOpnameDetailType,
  "produkId"
> {
  produk: Pick<IProduk, "id" | "kode" | "nama" | "hargaModalRataRata" | "img">;
}

// ==================================================
// FIND STOCK OPNAME DETAIL
// ==================================================

export interface FindStockOpnameDetailType {
  id: number;
}
