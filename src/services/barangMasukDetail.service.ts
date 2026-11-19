import instanceAxios from "../libs/axios";
import type {
  CreateBarangMasukDetailType,
  ResponseBarangMasukDaftarProdukWithMetaType,
  ResponseBarangMasukDetailType,
  UpdateBarangMasukDetailType,
} from "../models/barangMasukDetail.model";
import type { PaginationType } from "../models/pagination.model";
import type { StatusInventoriType } from "../types/constant.type";
import type { ResponseStructure } from "../types/response.type";

export class BarangMasukDetailServices {
  static async findByBarangMasukId(params: {
    barangMasukId: number;
    query: PaginationType;
  }): Promise<
    ResponseStructure<ResponseBarangMasukDaftarProdukWithMetaType | null>
  > {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseBarangMasukDaftarProdukWithMetaType | null>
    >(`/barang-masuk-detail/barang-masuk/${params.barangMasukId}`, {
      params: params.query,
    });

    return result.data;
  }

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

  // update
  static async update(params: {
    id: number;
    req: UpdateBarangMasukDetailType;
    status: StatusInventoriType;
  }): Promise<ResponseStructure<ResponseBarangMasukDetailType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseBarangMasukDetailType | null>
    >(
      `/barang-masuk-detail/${params.id}/status/${params.status.toLowerCase()}`,
      params.req,
    );

    return result.data;
  }

  // delete
  static async delete(params: {
    id: number;
    status: StatusInventoriType;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/barang-masuk-detail/${params.id}/status/${params.status.toLowerCase()}`,
    );

    return result.data;
  }
}
