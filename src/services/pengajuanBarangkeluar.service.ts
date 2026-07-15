import instanceAxios from "../libs/axios";
import type { ResponseBarangKeluarWithMetaType } from "../models/barangKeluar.model";
import type { PaginationType } from "../models/pagination.model";
import type {
  ResponsePengajuanBarangType,
  ResponsePengajuanBarangWithMetaType,
} from "../models/pengajuanBarang.model";
import type { StatusInventoriType } from "../types/constant.type";
import type { ResponseStructure } from "../types/response.type";

export class PengajuanBarangKeluarServices {
  // find all with author
  static async allWithAuthor(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseBarangKeluarWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseBarangKeluarWithMetaType | null>
    >(`/barang-keluar/author`, {
      params: query,
    });

    return result.data;
  }

  static async allByAuthor(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseBarangKeluarWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseBarangKeluarWithMetaType | null>
    >(`/barang-keluar/by-author`, {
      params: query,
    });

    return result.data;
  }

  //   riwayat pengajuan
  static async riwayatPengajuan(
    query: PaginationType & {
      barangKeluarId: number;
    },
  ): Promise<ResponseStructure<ResponsePengajuanBarangWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponsePengajuanBarangWithMetaType | null>
    >(`/pengajuan-barang`, {
      params: query,
    });

    return result.data;
  }

  // pengajuan
  static async pengajuan(params: {
    barangKeluarId?: number;
    keterangan?: string;
  }): Promise<ResponseStructure<ResponsePengajuanBarangType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePengajuanBarangType | null>
    >("/pengajuan-barang", params);

    return result.data;
  }

  //   verifikasi
  static async verifikasi(params: {
    barangKeluarId: number;
    keterangan?: string;
    status: Exclude<StatusInventoriType, "DRAFT" | "PENDING">;
  }): Promise<ResponseStructure<ResponsePengajuanBarangType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePengajuanBarangType | null>
    >("/pengajuan-barang/verifikasi", params);

    return result.data;
  }

  // cancel  verifikasi
  static async cancelVerifikasi(params: {
    barangKeluarId: number;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.post<ResponseStructure<null>>(
      "/pengajuan-barang/cancel-verifikasi",
      params,
    );

    return result.data;
  }
}
