import instanceAxios from "../libs/axios";
import type {
  CreateBarangMasukDetailType,
  ResponseBarangMasukDetailType,
} from "../models/barangMasukDetail.model";
import type { StatusInventoriType } from "../types/constant.type";
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

  // delete
  static async delete(params: {
    id: number;
    status: StatusInventoriType;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/barang-masuk-detail/${params.id}/status/${params.status}`,
    );

    return result.data;
  }
}
