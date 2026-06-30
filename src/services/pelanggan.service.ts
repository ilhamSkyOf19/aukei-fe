import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreatePelangganType,
  ResponsePelangganForKeranjangWithMetaType,
  ResponsePelangganType,
  ResponsePelangganWithMetaType,
  UpdatePelangganType,
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
    query: Pick<PaginationType, "page" | "search">,
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

  // create
  static async create(
    req: CreatePelangganType,
  ): Promise<ResponseStructure<ResponsePelangganType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePelangganType | null>
    >(`/pelanggan`, req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: UpdatePelangganType;
  }): Promise<ResponseStructure<ResponsePelangganType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePelangganType | null>
    >(`/pelanggan/${params.id}`, params.req);

    return result.data;
  }
}
