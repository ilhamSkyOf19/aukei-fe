import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  ResponseStatistikTempo,
  ResponseTempoWithPelangganWithMetaType,
} from "../models/tempo.model";
import type { ResponseStructure } from "../types/response.type";

export class TempoService {
  // find all
  static async findAll(
    query: PaginationType & {
      status?: string;
    },
  ): Promise<ResponseStructure<ResponseTempoWithPelangganWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTempoWithPelangganWithMetaType | null>
    >(`/tempo`, {
      params: query,
    });

    return result.data;
  }

  // statistik
  static async statistik(): Promise<
    ResponseStructure<ResponseStatistikTempo | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTempo | null>
    >(`/tempo/statistik`, {});

    return result.data;
  }
}
