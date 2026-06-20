import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreatePegawaiForRequestType,
  ResponsePegawaiType,
  ResponsePegawaiWithPaginationType,
  UpdatePegawaiForRequestType,
} from "../models/pegawai.model";
import type { ResponseStructure } from "../types/response.type";

export class PegawaiServices {
  // find all
  static async findAll(
    query: PaginationType,
  ): Promise<ResponseStructure<ResponsePegawaiWithPaginationType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponsePegawaiWithPaginationType | null>
    >(`/pegawai`, {
      params: query,
    });

    return result.data;
  }

  // create pegawai
  static async create(
    req: CreatePegawaiForRequestType,
  ): Promise<ResponseStructure<ResponsePegawaiType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePegawaiType | null>
    >(`/pegawai`, req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: UpdatePegawaiForRequestType;
  }): Promise<ResponseStructure<ResponsePegawaiType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponsePegawaiType | null>
    >(`/pegawai/${params.id}`, params.req);

    return result.data;
  }

  // delete
  static async delete(id: number): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/pegawai/${id}`,
    );

    return result.data;
  }

  // delete many
  static async deleteMany(ids: number[]): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/pegawai/delete-many`,
      { data: { ids } },
    );

    return result.data;
  }
}
