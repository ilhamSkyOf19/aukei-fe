import instanceAxios from "../libs/axios";
import type { ResponseNotifikasiGlobalType } from "../models/notifikasiGlobal.model";
import type { ResponseStructure } from "../types/response.type";

export class NotifikasiGlobalServices {
  // find all
  static async findAll(): Promise<
    ResponseStructure<ResponseNotifikasiGlobalType | null>
  > {
    // call api
    const result =
      await instanceAxios.get<
        ResponseStructure<ResponseNotifikasiGlobalType | null>
      >("/notifikasi-global");

    return result.data;
  }
}
