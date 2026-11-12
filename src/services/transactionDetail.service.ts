import instanceAxios from "../libs/axios";
import type {
  ResponseTransactionDetailType,
  UpdateHargaAndDiskonAndQuantityForRequestType,
} from "../models/transactionDetail.model";
import type { ResponseStructure } from "../types/response.type";

export class TransactionDetailServices {
  // payment
  static async updateTransaksiDetail(params: {
    transactionDetailId: number;
    req: UpdateHargaAndDiskonAndQuantityForRequestType;
  }): Promise<ResponseStructure<ResponseTransactionDetailType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseTransactionDetailType | null>
    >(`/transaction-detail/${params.transactionDetailId}`, params.req);

    return result.data;
  }

  static async updateOld(params: {
    transactionId: number;
  }): Promise<ResponseStructure<ResponseTransactionDetailType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseTransactionDetailType | null>
    >(`/transaction-detail/old/${params.transactionId}`);

    return result.data;
  }

  // delete
  static async delete(params: {
    transactionDetailId: number;
  }): Promise<ResponseStructure<null>> {
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/transaction-detail/${params.transactionDetailId}`,
    );

    return result.data;
  }
}
