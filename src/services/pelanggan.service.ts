import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  ResponsePelangganForKeranjangWithMetaType,
  ResponsePelangganWithMetaType,
} from "../models/pelanggan.model";
import type { ResponseStructure } from "../types/response.type";

export class PelangganServices {
  // find all
  static async findAll(
    query: PaginationType,
  ): Promise<ResponseStructure<ResponsePelangganWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponsePelangganWithMetaType | null>
    >(`/pelanggan`, {
      params: query,
    });

    return result.data;
  }

  // find all for keranjang
  static async findAllForKeranjang(
    query: PaginationType,
  ): Promise<
    ResponseStructure<ResponsePelangganForKeranjangWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponsePelangganForKeranjangWithMetaType | null>
    >(`/pelanggan/for-keranjang`, {
      params: query,
    });

    return result.data;
  }
}
