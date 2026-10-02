import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type { ResponsePelangganWithRiwayatAndMetaType } from "../models/pelanggan.model";
import type {
  CreateShadowCutTransactionType,
  ResponseCreateShadowTransactionType,
} from "../models/shadowTransaction.model";
import type {
  ResponseRiwayatTransactionType,
  ResponseRiwayatTransaksiPelangganType,
} from "../models/transaction.model";
import type { ResponseStructure } from "../types/response.type";

export class ShadowTransactionServices {
  // cut all
  static async cutAll(
    data: CreateShadowCutTransactionType,
  ): Promise<ResponseStructure<ResponseCreateShadowTransactionType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseCreateShadowTransactionType | null>
    >(`/shadow-transaction/cut-all`, data);

    return result.data;
  }

  // find riwayat
  static async findRiwayatTransaksiShadow(params: {
    shadowFeatureId: number;
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
      metodePembayaran?: string;
    };
  }): Promise<ResponseStructure<ResponseRiwayatTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatTransactionType | null>
    >(
      `/shadow-transaction/riwayat-transaction/shadow/${params.shadowFeatureId}`,
      { params: params.query },
    );

    return result.data;
  }

  // find shadow transaction by pelanggan and shadow id
  static async findRiwayatTransaksiCompletedNotTempoByPelanggan(params: {
    shadowId: number;
    id: number;
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
      metodePembayaran?: string;
    };
  }): Promise<ResponseStructure<ResponseRiwayatTransaksiPelangganType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatTransaksiPelangganType | null>
    >(
      `/shadow-transaction/transaction-completed/pelanggan/${params.id}/shadow/${params.shadowId}`,
      {
        params: params.query,
      },
    );

    return result.data;
  }

  // find all with riwayat
  static async findAllWithRiwayat(params: {
    query: PaginationType;
    shadowId: number;
  }): Promise<
    ResponseStructure<ResponsePelangganWithRiwayatAndMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponsePelangganWithRiwayatAndMetaType | null>
    >(`/shadow-transaction/pelanggan-with-riwayat/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }
}
