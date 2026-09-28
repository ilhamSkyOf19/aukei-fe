import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreateShadowTransactionType,
  ResponseCreateShadowTransactionType,
} from "../models/shadowTransaction.model";
import type {
  ResponseRiwayatTransactionType,
  ResponseRiwayatTransaksiPelangganType,
  ResponseTransactionType,
} from "../models/transaction.model";
import type { ResponseStructure } from "../types/response.type";

export class ShadowTransactionServices {
  // create
  static async create(
    data: CreateShadowTransactionType,
  ): Promise<ResponseStructure<ResponseCreateShadowTransactionType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseCreateShadowTransactionType | null>
    >(`/shadow-transaction/`, data);

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

  // find shadow transaction by transaction id
  static async findShadowTransactionByTransactionId(params: {
    transactionId: number;
    shadowId: number;
  }): Promise<ResponseStructure<ResponseTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTransactionType | null>
    >(
      `/shadow-transaction/transaction/${params.transactionId}/shadow/${params.shadowId}`,
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
}
