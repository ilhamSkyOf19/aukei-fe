import instanceAxios from "../libs/axios";
import type {
  CreateKeranjangType,
  ResponseKeranjangType,
  UpdateKeranjangType,
} from "../models/keranjang.model";
import type { ResponseTransactionType } from "../models/transaction.model";
import type { ResponseStructure } from "../types/response.type";

export class KeranjangServices {
  // create for keranjang
  static async create(
    req: CreateKeranjangType,
  ): Promise<ResponseStructure<ResponseKeranjangType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTransactionType | null>
    >("/keranjang", req);

    return result.data;
  }

  // update for keranjang
  static async update(params: {
    id: number;
    req: UpdateKeranjangType;
  }): Promise<ResponseStructure<ResponseKeranjangType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseTransactionType | null>
    >(`/keranjang/${params.id}`, params.req);

    return result.data;
  }

  // find for keranjang by pelanggan id
  static async findByPelangganId(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTransactionType | null>
    >(`/keranjang/pelanggan/${params.id}`);

    return result.data;
  }
}
