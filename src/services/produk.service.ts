import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  ProdukResponseType,
  ResponseProdukWithMetaType,
} from "../models/produk.model";
import type { ResponseStructure } from "../types/response.type";

export class ProdukServices {
  // find all
  static async findAll(
    query: PaginationType & {
      kategori?: string;
    },
  ): Promise<ResponseStructure<ResponseProdukWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseProdukWithMetaType | null>
    >(`/produk`, {
      params: query,
    });

    return result.data;
  }

  // create
  static async create(
    req: FormData,
  ): Promise<ResponseStructure<ProdukResponseType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ProdukResponseType | null>
    >(`/produk`, req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: FormData;
  }): Promise<ResponseStructure<ProdukResponseType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ProdukResponseType | null>
    >(`/produk/${params.id}`, params.req);

    return result.data;
  }

  // update is active
  static async updateStatus(params: {
    id: number;
    status: boolean;
  }): Promise<ResponseStructure<ProdukResponseType | null>> {
    const { id, status } = params;

    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ProdukResponseType | null>
    >(`/produk/${id}/active`, { status });

    return result.data;
  }

  // detail
  static async detail(params: {
    id: number;
  }): Promise<ResponseStructure<ProdukResponseType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ProdukResponseType | null>
    >(`/produk/${params.id}`);

    return result.data;
  }

  // delete
  static async delete(id: number): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/produk/${id}`,
    );

    return result.data;
  }
}
