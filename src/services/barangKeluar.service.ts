import instanceAxios from "../libs/axios";
import type {
  CreateBarangKeluarForRequestType,
  ResponseBarangKeluarType,
  ResponseBarangKeluarWithDetailType,
  ResponseBarangKeluarWithMetaType,
  UpdateBarangKeluarForRequestType,
} from "../models/barangKeluar.model";
import type { PaginationType } from "../models/pagination.model";
import type { ResponseStructure } from "../types/response.type";

export class BarangKeluarServices {
  // find all
  static async all(
    query: PaginationType,
  ): Promise<ResponseStructure<ResponseBarangKeluarWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseBarangKeluarWithMetaType | null>
    >(`/barang-keluar`, {
      params: query,
    });

    return result.data;
  }

  //   // create
  static async create(
    req: CreateBarangKeluarForRequestType,
  ): Promise<ResponseStructure<ResponseBarangKeluarType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseBarangKeluarType | null>
    >(`/barang-keluar`, req);

    return result.data;
  }

  //   // update
  static async update(params: {
    id: number;
    req: UpdateBarangKeluarForRequestType;
  }): Promise<ResponseStructure<ResponseBarangKeluarType | null>> {
    const { id, req } = params;

    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseBarangKeluarType | null>
    >(`/barang-keluar/${id}`, req);

    return result.data;
  }

  // detail
  static async detail(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseBarangKeluarWithDetailType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseBarangKeluarWithDetailType | null>
    >(`/barang-keluar/${params.id}`);

    return result.data;
  }

  //   // posted
  static async posted(
    barangKeluarId: number,
  ): Promise<ResponseStructure<ResponseBarangKeluarWithMetaType | null>> {
    // call api
    const result = await instanceAxios.put<
      ResponseStructure<ResponseBarangKeluarWithMetaType | null>
    >(`/barang-keluar/${barangKeluarId}/posted`);

    return result.data;
  }

  //   // cancel posted
  static async cancelPosted(
    barangKeluarId: number,
  ): Promise<ResponseStructure<ResponseBarangKeluarWithMetaType | null>> {
    // call api
    const result = await instanceAxios.put<
      ResponseStructure<ResponseBarangKeluarWithMetaType | null>
    >(`/barang-keluar/${barangKeluarId}/cancel-posted`);

    return result.data;
  }

  // delete
  static async delete(id: number): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/barang-keluar/${id}`,
    );

    return result.data;
  }

  // delete
  static async deleteMany(ids: number[]): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/barang-keluar/delete-many`,
      {
        data: {
          ids,
        },
      },
    );

    return result.data;
  }
}
