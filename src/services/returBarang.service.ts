import instanceAxios from "../libs/axios";
import type {
  CreateReturBarangForService,
  ResponseReturnDetailType,
} from "../models/returBarang.model";
import type { ResponseStructure } from "../types/response.type";

export class ReturBarangServices {
  // get all
  static async create(
    req: CreateReturBarangForService,
  ): Promise<ResponseStructure<ResponseReturnDetailType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseReturnDetailType | null>
    >("/return", req);

    return result.data;
  }
}
