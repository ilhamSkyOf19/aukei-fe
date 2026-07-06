import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreateTransactionForRequestType,
  QueryRiwayatTransactionType,
  ResponseChartType,
  ResponseRingkasanStatistikType,
  ResponseRiwayatTransactionType,
  ResponseStatistikWithPersentaseType,
  ResponseTransactionType,
} from "../models/transaction.model";
import type { ResponseStructure } from "../types/response.type";

export class TransactionServices {
  // create
  static async create(
    req: CreateTransactionForRequestType,
  ): Promise<ResponseStructure<ResponseTransactionType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTransactionType | null>
    >("/transaction", req);

    return result.data;
  }

  // find by id
  static async findById(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTransactionType | null>
    >(`/transaction/${params.id}`);

    return result.data;
  }

  // ringkasan riwayat
  static async ringkasanStatistik(
    query: QueryRiwayatTransactionType,
  ): Promise<ResponseStructure<ResponseRingkasanStatistikType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRingkasanStatistikType | null>
    >("/transaction/ringkasan", { params: query });

    return result.data;
  }

  static async findRiwayatTransaksi(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
      metodePembayaran?: string;
      statusTempo?: string;
    },
  ): Promise<ResponseStructure<ResponseRiwayatTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatTransactionType | null>
    >("/transaction", { params: query });

    return result.data;
  }

  // find statistik with persentase
  static async findStatistikWithPersentase(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseStatistikWithPersentaseType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikWithPersentaseType | null>
    >("/transaction/statistik", { params: query });

    return result.data;
  }

  // get chart omzet
  static async chartOmzet(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/transaction/chart-omzet", { params: query });

    return result.data;
  }
}
