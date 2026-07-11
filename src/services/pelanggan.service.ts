import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreatePelangganType,
  ResponsePelangganForKeranjangWithMetaType,
  ResponsePelangganType,
  ResponsePelangganWithMetaType,
  ResponsePelangganWithRiwayatAndMetaType,
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

  // find all with riwayat
  static async findAllWithRiwayat(
    query: PaginationType,
  ): Promise<
    ResponseStructure<ResponsePelangganWithRiwayatAndMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponsePelangganWithRiwayatAndMetaType | null>
    >(`/pelanggan/with-riwayat`, {
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
    const result = await instanceAxios.patch<
      ResponseStructure<ResponsePelangganType | null>
    >(`/pelanggan/${params.id}`, params.req);

    return result.data;
  }

  // update
  static async updateisActive(params: {
    id: number;
    req: { status: boolean };
  }): Promise<ResponseStructure<ResponsePelangganType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponsePelangganType | null>
    >(`/pelanggan/${params.id}/active`, params.req);

    return result.data;
  }

  // delete
  static async delete(params: {
    id: number;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/pelanggan/${params.id}`,
    );

    return result.data;
  }

  // delete many
  static async deleteMany(params: {
    ids: number[];
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/pelanggan/many`,
      { data: { ids: params.ids } },
    );

    return result.data;
  }
}
