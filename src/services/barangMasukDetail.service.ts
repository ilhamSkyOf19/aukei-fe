import instanceAxios from "../libs/axios";
import type {
  CreateBarangMasukDetailType,
  ResponseBarangMasukDetailType,
} from "../models/barangMasukDetail.model";
import type { ResponseStructure } from "../types/response.type";

export class BarangMasukDetailServices {
  // add barang
  static async addBarang(
    req: CreateBarangMasukDetailType,
  ): Promise<ResponseStructure<ResponseBarangMasukDetailType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseBarangMasukDetailType | null>
    >(`/barang-masuk-detail`, req);

    return result.data;
  }
}
