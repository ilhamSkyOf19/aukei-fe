import instanceAxios from "../libs/axios";

import type {
  CreateStockOpnameForRequestType,
  ResponseStockOpnameType,
  ResponseStockOpnameWithDetailType,
  ResponseStockOpnameWithMetaType,
  UpdateStockOpnameForRequestType,
} from "../models/stockOpname.model";

import type { PaginationType } from "../models/pagination.model";

import type { ResponseStructure } from "../types/response.type";

export class StockOpnameServices {
  // ============================================================
  // FIND ALL
  // ============================================================

  static async all(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseStockOpnameWithMetaType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStockOpnameWithMetaType | null>
    >(`/stock-opname`, {
      params: query,
    });

    return result.data;
  }

  // ============================================================
  // FIND ALL WITH AUTHOR
  // ============================================================

  static async allWithAuthor(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseStockOpnameWithMetaType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStockOpnameWithMetaType | null>
    >(`/stock-opname/author`, {
      params: query,
    });

    return result.data;
  }

  // ============================================================
  // FIND ALL BY AUTHOR
  // ============================================================

  static async allByAuthor(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseStockOpnameWithMetaType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStockOpnameWithMetaType | null>
    >(`/stock-opname/by-author`, {
      params: query,
    });

    return result.data;
  }

  // ============================================================
  // CREATE
  // ============================================================

  static async create(
    req: CreateStockOpnameForRequestType,
  ): Promise<ResponseStructure<ResponseStockOpnameType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseStockOpnameType | null>
    >(`/stock-opname`, req);

    return result.data;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  static async update(params: {
    id: number;
    req: UpdateStockOpnameForRequestType;
  }): Promise<ResponseStructure<ResponseStockOpnameType | null>> {
    const { id, req } = params;

    const result = await instanceAxios.patch<
      ResponseStructure<ResponseStockOpnameType | null>
    >(`/stock-opname/${id}`, req);

    return result.data;
  }

  // ============================================================
  // POSTED
  // ============================================================

  static async posted(
    id: number,
  ): Promise<ResponseStructure<ResponseStockOpnameWithDetailType | null>> {
    const result = await instanceAxios.put<
      ResponseStructure<ResponseStockOpnameWithDetailType | null>
    >(`/stock-opname/${id}/posted`);

    return result.data;
  }

  // ============================================================
  // CANCEL POSTED
  // ============================================================

  static async cancelPosted(
    id: number,
  ): Promise<ResponseStructure<ResponseStockOpnameWithDetailType | null>> {
    const result = await instanceAxios.put<
      ResponseStructure<ResponseStockOpnameWithDetailType | null>
    >(`/stock-opname/${id}/cancel-posted`);

    return result.data;
  }

  // ============================================================
  // DETAIL
  // ============================================================

  static async detail(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseStockOpnameWithDetailType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStockOpnameWithDetailType | null>
    >(`/stock-opname/${params.id}`);

    return result.data;
  }

  // ============================================================
  // DELETE
  // ============================================================

  static async delete(id: number): Promise<ResponseStructure<null>> {
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/stock-opname/${id}`,
    );

    return result.data;
  }
}
