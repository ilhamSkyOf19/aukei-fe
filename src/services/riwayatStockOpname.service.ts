import instanceAxios from "../libs/axios";
import type { ResponseRiwayatStockOpnameForHighlightType } from "../models/riwayatStockOpname.model";
import type { ResponseStructure } from "../types/response.type";

export class RiwayatPengajuanStockOpnameService {
  // find all for highlight
  static async findAllForHighlight(): Promise<
    ResponseStructure<ResponseRiwayatStockOpnameForHighlightType[] | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatStockOpnameForHighlightType[] | null>
    >(`/riwayat-stock-opname/highlight`);

    return result.data;
  }
}
