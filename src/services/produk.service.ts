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
}
