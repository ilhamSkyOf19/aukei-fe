import instanceAxios from "../libs/axios";
import type {
  CreateTransactionForKeranjangType,
  CreateTransactionForRequestType,
  ResponseTransactionForKeranjangType,
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

  // create for keranjang
  static async createForKeranjang(
    req: CreateTransactionForKeranjangType,
  ): Promise<ResponseStructure<ResponseTransactionForKeranjangType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTransactionForKeranjangType | null>
    >("/transaction/for-keranjang", req);

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
}
