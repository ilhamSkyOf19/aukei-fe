import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreateTransactionForRequestType,
  ResponseRiwayatTransactionType,
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
}
