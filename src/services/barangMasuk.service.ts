import instanceAxios from "../libs/axios";
import type {
  CreateBarangMasukForRequestType,
  ResponseBarangMasukType,
  ResponseBarangMasukWithDetailType,
  ResponseBarangMasukWithMetaType,
  UpdateBarangMasukForRequestType,
} from "../models/barangMasuk.model";
import type { PaginationType } from "../models/pagination.model";
import type { ResponseStructure } from "../types/response.type";

export class BarangMasukServices {
  // find all
  static async all(
    query: PaginationType,
  ): Promise<ResponseStructure<ResponseBarangMasukWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseBarangMasukWithMetaType | null>
    >(`/barang-masuk`, {
      params: query,
    });

    return result.data;
  }

  // create
  static async create(
    req: CreateBarangMasukForRequestType,
  ): Promise<ResponseStructure<ResponseBarangMasukType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseBarangMasukType | null>
    >(`/barang-masuk`, req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: UpdateBarangMasukForRequestType;
  }): Promise<ResponseStructure<ResponseBarangMasukType | null>> {
    const { id, req } = params;

    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseBarangMasukType | null>
    >(`/barang-masuk/${id}`, req);

    return result.data;
  }

  // detail
  static async detail(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseBarangMasukWithDetailType | null>> {
    // call api
    const result = instanceAxios.get<
      ResponseStructure<ResponseBarangMasukWithDetailType | null>
    >(`/barang-masuk/${params.id}`);

    return (await result).data;
  }

  // posted
  static async posted(
    barangMasukId: number,
  ): Promise<ResponseStructure<ResponseBarangMasukWithMetaType | null>> {
    // call api
    const result = await instanceAxios.put<
      ResponseStructure<ResponseBarangMasukWithMetaType | null>
    >(`/barang-masuk/${barangMasukId}/posted`);

    return result.data;
  }

  // cancel posted
  static async cancelPosted(
    barangMasukId: number,
  ): Promise<ResponseStructure<ResponseBarangMasukWithMetaType | null>> {
    // call api
    const result = await instanceAxios.put<
      ResponseStructure<ResponseBarangMasukWithMetaType | null>
    >(`/barang-masuk/${barangMasukId}/cancel-posted`);

    return result.data;
  }

  // delete
  static async delete(id: number): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/barang-masuk/${id}`,
    );

    return result.data;
  }

  // delete many
  static async deleteMany(ids: number[]): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/barang-masuk/delete-many`,
      { data: { ids } },
    );

    return result.data;
  }
}
