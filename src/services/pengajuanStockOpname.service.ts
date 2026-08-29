import instanceAxios from "../libs/axios";

import type { ResponseStockOpnameWithMetaType } from "../models/stockOpname.model";

import type { PaginationType } from "../models/pagination.model";

import type {
  ResponseRiwayatStockOpnameType,
  ResponseRiwayatStockOpnameWithMetaType,
} from "../models/riwayatStockOpname.model";

import type { StatusStockOpnameType } from "../types/constant.type";

import type { ResponseStructure } from "../types/response.type";

export class PengajuanStockOpnameServices {
  // ============================================================
  // FIND ALL BY AUTHOR
  // ============================================================

  static async allByAuthor(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseStockOpnameWithMetaType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStockOpnameWithMetaType | null>
    >("/stock-opname/by-author", {
      params: query,
    });

    return result.data;
  }

  // ============================================================
  // FIND ALL WITH AUTHOR
  // ============================================================

  static async allWithAuthor(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseStockOpnameWithMetaType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStockOpnameWithMetaType | null>
    >("/stock-opname/author", {
      params: query,
    });

    return result.data;
  }

  // ============================================================
  // RIWAYAT PENGAJUAN
  // ============================================================

  static async riwayatPengajuan(
    query: PaginationType & {
      stockOpnameId: number;
    },
  ): Promise<ResponseStructure<ResponseRiwayatStockOpnameWithMetaType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatStockOpnameWithMetaType | null>
    >("/pengajuan-stock-opname", {
      params: query,
    });

    return result.data;
  }

  // ============================================================
  // PENGAJUAN
  // ============================================================

  static async pengajuan(params: {
    stockOpnameId: number;
    keterangan?: string;
  }): Promise<ResponseStructure<ResponseRiwayatStockOpnameType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseRiwayatStockOpnameType | null>
    >("/pengajuan-stock-opname", params);

    return result.data;
  }

  // ============================================================
  // VERIFIKASI
  // ============================================================

  static async verifikasi(params: {
    stockOpnameId: number;

    keterangan?: string;

    status: Exclude<StatusStockOpnameType, "DRAFT" | "PENDING">;
  }): Promise<ResponseStructure<ResponseRiwayatStockOpnameType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseRiwayatStockOpnameType | null>
    >("/pengajuan-stock-opname/verifikasi", params);

    return result.data;
  }

  // ============================================================
  // CANCEL VERIFIKASI
  // ============================================================

  static async cancelVerifikasi(params: {
    stockOpnameId: number;
  }): Promise<ResponseStructure<null>> {
    const result = await instanceAxios.post<ResponseStructure<null>>(
      "/pengajuan-stock-opname/cancel-verifikasi",
      params,
    );

    return result.data;
  }
}
