import instanceAxios from "../libs/axios";
import type { ResponseJenisKeluarType } from "../models/jenisKeluar.model";
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
}
