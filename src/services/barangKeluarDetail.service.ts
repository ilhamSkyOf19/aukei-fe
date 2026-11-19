import instanceAxios from "../libs/axios";
import type {
  CreateBarangKeluarDetailType,
  ResponseBarangKeluarDetailType,
  ResponseBarangKeluarDetailWithMetaType,
  UpdateBarangKeluarDetailType,
} from "../models/barangKeluarDetail.model";
import type { PaginationType } from "../models/pagination.model";
import type { StatusInventoriType } from "../types/constant.type";
import type { ResponseStructure } from "../types/response.type";

export class BarangKeluarDetailServices {
  static async findByBarangKeluarId(params: {
    barangKeluarId: number;
    query: PaginationType;
  }): Promise<
    ResponseStructure<ResponseBarangKeluarDetailWithMetaType | null>
  > {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseBarangKeluarDetailWithMetaType | null>
    >(`/barang-keluar-detail/barang-keluar/${params.barangKeluarId}`, {
      params: params.query,
    });

    return result.data;
  }

  // add barang
  static async addBarangKeluar(
    req: CreateBarangKeluarDetailType,
  ): Promise<ResponseStructure<ResponseBarangKeluarDetailType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseBarangKeluarDetailType | null>
    >(`/barang-keluar-detail`, req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: UpdateBarangKeluarDetailType;
    status: StatusInventoriType;
  }): Promise<ResponseStructure<ResponseBarangKeluarDetailType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseBarangKeluarDetailType | null>
    >(`/barang-keluar-detail/${params.id}/status/${params.status}`, params.req);

    return result.data;
  }

  // delete
  static async delete(params: {
    id: number;
    status: StatusInventoriType;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/barang-keluar-detail/${params.id}/status/${params.status}`,
    );

    return result.data;
  }
}
