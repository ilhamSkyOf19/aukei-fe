import instanceAxios from "../libs/axios";
import type {
  CreateBarangMasukForRequestType,
  ResponseBarangMasukType,
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
}
