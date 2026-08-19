import instanceAxios from "../libs/axios";
import type {
  CreateJenisKeluarType,
  ResponseJenisKeluarType,
  UpdateJenisKeluarType,
} from "../models/jenisKeluar.model";
import type { ResponseStructure } from "../types/response.type";

export class JenisKeluarServices {
  // find all
  static async findAll(): Promise<
    ResponseStructure<ResponseJenisKeluarType[] | null>
  > {
    // call api
    const result =
      await instanceAxios.get<
        ResponseStructure<ResponseJenisKeluarType[] | null>
      >("/jenis-keluar");

    return result.data;
  }

  // find by id
  static async findById(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseJenisKeluarType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseJenisKeluarType | null>
    >(`/jenis-keluar/${params.id}`);

    return result.data;
  }

  // create
  static async create(
    req: CreateJenisKeluarType,
  ): Promise<ResponseStructure<ResponseJenisKeluarType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseJenisKeluarType | null>
    >(`/jenis-keluar`, req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: Pick<UpdateJenisKeluarType, "nama">;
  }): Promise<ResponseStructure<ResponseJenisKeluarType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseJenisKeluarType | null>
    >(`/jenis-keluar/${params.id}`, params.req);

    return result.data;
  }

  // delete
  static async delete(params: {
    id: number;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/jenis-keluar/${params.id}`,
    );

    return result.data;
  }
}
