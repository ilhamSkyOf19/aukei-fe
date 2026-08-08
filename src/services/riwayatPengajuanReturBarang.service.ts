import instanceAxios from "../libs/axios";
import type {
  ResponseRiwayatPengajuanReturnForHighlightType,
  ResponseRiwayatPengajuanReturnWithMetaType,
} from "../models/riwayatPengajuanReturBarang.model";
import type { ResponseStructure } from "../types/response.type";

export class RiwayatPengajuanReturBarangService {
  // find all
  static async findAllByReturBarang(params: {
    id: number;
  }): Promise<
    ResponseStructure<ResponseRiwayatPengajuanReturnWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatPengajuanReturnWithMetaType | null>
    >(`/riwayat-pengajuan-return/return-transaction/${params.id}`);

    return result.data;
  }

  // find all for highlight
  static async findAllByReturBarangForHighlight(): Promise<
    ResponseStructure<ResponseRiwayatPengajuanReturnForHighlightType[] | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatPengajuanReturnForHighlightType[] | null>
    >(`/riwayat-pengajuan-return/highlight`);

    return result.data;
  }
}
