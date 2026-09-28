import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  ResponseTempoWithInstallment,
  ResponseTempoWithPelangganWithMetaType,
} from "../models/tempo.model";
import type { ResponseStructure } from "../types/response.type";

export class ShadowTempoServices {
  static async findAll(params: {
    shadowId: number;
    query: PaginationType & {
      status?: string;
    };
  }): Promise<
    ResponseStructure<ResponseTempoWithPelangganWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTempoWithPelangganWithMetaType | null>
    >(`/shadow-tempo/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  static async findWithInstallmenstByTempoId(params: {
    id: number;
    shadowId: number;
  }): Promise<ResponseStructure<ResponseTempoWithInstallment | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTempoWithInstallment | null>
    >(`/shadow-tempo/tempo/${params.id}/shadow/${params.shadowId}`, {});

    return result.data;
  }
}
