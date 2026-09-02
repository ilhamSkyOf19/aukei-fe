import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  AddReturnDetailByIdRequestType,
  AddReturnDetailRequestType,
  AddReturnDetailResponseType,
  DeleteReturnDetailParamsType,
  ResponseDataReturBarangDetailType,
  ResponseFindAllReturnType,
  ResponsePengajuanReturnType,
  ResponseReturnForByIdType,
  UpdateReturnDetailRequestType,
  UpdateReturnDetailResponseType,
} from "../models/returBarang.model";
import type { ReturnStatus } from "../types/constant.type";

import type { ResponseStructure } from "../types/response.type";

export class ReturBarangServices {
  /**
   * ============================================================
   * ADD RETURN DETAIL
   * ============================================================
   *
   * POST /return/detail
   */
  static async addReturnDetail(
    req: AddReturnDetailRequestType,
  ): Promise<ResponseStructure<AddReturnDetailResponseType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<AddReturnDetailResponseType | null>
    >("/return/detail", req);

    return result.data;
  }

  static async addReturnDetailById(
    req: AddReturnDetailByIdRequestType,
  ): Promise<ResponseStructure<AddReturnDetailResponseType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<AddReturnDetailResponseType | null>
    >("/return/by-id/detail", req);

    return result.data;
  }

  /**
   * ============================================================
   * UPDATE RETURN DETAIL
   * ============================================================
   *
   * PUT /return/:returnTransactionId/detail/:returnDetailId
   */
  static async updateReturnDetail(params: {
    returnTransactionId: number;
    returnDetailId: number;
    req: UpdateReturnDetailRequestType;
  }): Promise<ResponseStructure<UpdateReturnDetailResponseType | null>> {
    const { returnTransactionId, returnDetailId, req } = params;

    const result = await instanceAxios.put<
      ResponseStructure<UpdateReturnDetailResponseType | null>
    >(`/return/${returnTransactionId}/detail/${returnDetailId}`, req);

    return result.data;
  }

  static async findDraftByReturnTransactionId(params: {
    transactionId: number;
  }): Promise<ResponseStructure<ResponseDataReturBarangDetailType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseDataReturBarangDetailType | null>
    >(`/return/draft/transaction/${params.transactionId}`);

    return result.data;
  }

  /**
   * ============================================================
   * DELETE RETURN DETAIL
   * ============================================================
   *
   * DELETE /return/:returnTransactionId/detail/:returnDetailId
   */
  static async deleteReturnDetail(
    params: DeleteReturnDetailParamsType,
  ): Promise<ResponseStructure<null>> {
    const { returnTransactionId, returnDetailId } = params;

    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/return/${returnTransactionId}/detail/${returnDetailId}`,
    );

    return result.data;
  }

  // pengajuan
  static async pengajuan(data: {
    id: number;
    keterangan?: string;
  }): Promise<ResponseStructure<ResponsePengajuanReturnType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponsePengajuanReturnType | null>
    >(`/return/pengajuan`, data);

    return result.data;
  }

  // find all
  static async findAll(params: {
    transactionId: number;
    query: PaginationType & { status?: string };
  }): Promise<ResponseStructure<ResponseFindAllReturnType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseFindAllReturnType | null>
    >(`/return/transaction/${params.transactionId}`, {
      params: params.query,
    });

    return result.data;
  }

  // find details by id
  static async findReturnDetails(params: {
    returId: number;
  }): Promise<ResponseStructure<ResponseDataReturBarangDetailType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseDataReturBarangDetailType | null>
    >(`/return/${params.returId}/details`, {});

    return result.data;
  }

  // find by id
  static async findById(params: {
    returId: number;
  }): Promise<ResponseStructure<ResponseReturnForByIdType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseReturnForByIdType | null>
    >(`/return/${params.returId}`, {});

    return result.data;
  }

  // verifikasi
  static async posted(data: {
    kodeReferensi: string;
  }): Promise<ResponseStructure<ResponseReturnForByIdType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseReturnForByIdType | null>
    >(`/return/posted`, data);

    return result.data;
  }

  // verifikasi
  static async verifikasi(data: {
    kodeReferensi: string;
    status: Extract<ReturnStatus, "APPROVED" | "REJECTED">;
    keterangan?: string;
  }): Promise<ResponseStructure<ResponseReturnForByIdType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseReturnForByIdType | null>
    >(`/return/verifikasi`, data);

    return result.data;
  }

  // delete
  static async delete(params: { returId: number }): Promise<
    ResponseStructure<{
      id: number;
      kodeReferensi: string;
      status: ReturnStatus;
    } | null>
  > {
    const { returId } = params;

    const result = await instanceAxios.delete<
      ResponseStructure<{
        id: number;
        kodeReferensi: string;
        status: ReturnStatus;
      } | null>
    >(`/return/${returId}`);

    return result.data;
  }
}
