import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreateReturBarangForService,
  ResponseDataReturBarangDetailType,
  ResponseRegularReturnTransactionType,
  ResponseRegularReturnTransactionWithMetaType,
  ResponseReturnDetailType,
  ResponseReturnForByIdType,
  ResponseUpdateStatusReturnTransactionType,
  UpdateReturnForServiceType,
} from "../models/returBarang.model";
import type { StatusInventoriType } from "../types/constant.type";
import type { ResponseStructure } from "../types/response.type";

export class ReturBarangServices {
  // create
  static async create(
    req: CreateReturBarangForService,
  ): Promise<ResponseStructure<ResponseReturnDetailType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseReturnDetailType | null>
    >("/return", req);

    return result.data;
  }

  // find all
  static async findAll(params: {
    transactionId: number;
    query: PaginationType & {
      status?: string;
    };
  }): Promise<
    ResponseStructure<ResponseRegularReturnTransactionWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRegularReturnTransactionWithMetaType | null>
    >(`/return/transaction/${params.transactionId}`, { params: params.query });

    return result.data;
  }

  // find by id
  static async findById(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseReturnForByIdType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseReturnForByIdType | null>
    >(`/return/${params.id}`);

    return result.data;
  }

  // verifikasi
  static async verifikasi(params: {
    kodeReferensi: string;
    keterangan?: string;
    status: Exclude<StatusInventoriType, "DRAFT" | "PENDING">;
  }): Promise<ResponseStructure<ResponseRegularReturnTransactionType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseRegularReturnTransactionType | null>
    >("/return/verifikasi", params);

    return result.data;
  }

  static async pengajuan(params: {
    id: number;
    keterangan?: string;
  }): Promise<
    ResponseStructure<ResponseUpdateStatusReturnTransactionType | null>
  > {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseUpdateStatusReturnTransactionType | null>
    >("/return/pengajuan", params);

    return result.data;
  }

  static async findAllByReturnTransactionId(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseDataReturBarangDetailType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseDataReturBarangDetailType | null>
    >(`/return/${params.id}/return-details`);

    return result.data;
  }

  // delete
  static async delete(params: {
    id: number;
  }): Promise<ResponseStructure<null>> {
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/return/${params.id}`,
    );

    return result.data;
  }

  // update
  static async update(params: {
    returnTransactionId: number;
    req: UpdateReturnForServiceType;
  }): Promise<ResponseStructure<ResponseReturnDetailType | null>> {
    const { req, returnTransactionId } = params;
    const result = await instanceAxios.put<
      ResponseStructure<ResponseReturnDetailType | null>
    >(`/return/${returnTransactionId}`, req);

    return result.data;
  }
}
