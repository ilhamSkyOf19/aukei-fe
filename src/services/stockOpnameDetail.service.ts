import instanceAxios from "../libs/axios";

import type {
  UpdateStockOpnameDetailType,
  ResponseStockOpnameDetailType,
  CreateStockOpnameDetailArrayForServiceType,
} from "../models/stockOpnameDetail.model";

import type { ResponseStructure } from "../types/response.type";

export class StockOpnameDetailServices {
  // ============================================================
  // CREATE
  // ============================================================

  static async create(
    req: CreateStockOpnameDetailArrayForServiceType,
  ): Promise<ResponseStructure<ResponseStockOpnameDetailType[] | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseStockOpnameDetailType[] | null>
    >("/stock-opname-detail", req);

    return result.data;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  static async update(params: {
    id: number;

    status: string;

    req: UpdateStockOpnameDetailType;
  }): Promise<ResponseStructure<ResponseStockOpnameDetailType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseStockOpnameDetailType | null>
    >(`/stock-opname-detail/${params.id}/status/${params.status}`, params.req);

    return result.data;
  }

  // ============================================================
  // DELETE
  // ============================================================

  static async delete(params: {
    id: number;
    status: string;
  }): Promise<ResponseStructure<null>> {
    const { id, status } = params;

    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/stock-opname-detail/${id}/status/${status}`,
    );

    return result.data;
  }
}
