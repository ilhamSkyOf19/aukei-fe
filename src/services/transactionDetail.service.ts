import instanceAxios from "../libs/axios";
import type {
  ResponseTransactionDetailType,
  UpdateHargaAndDiskonForRequestType,
} from "../models/transactionDetail.model";
import type { ResponseStructure } from "../types/response.type";

export class TransactionDetailServices {
  // payment
  static async updateHargaOrDiskon(params: {
    transactionDetailId: number;
    req: UpdateHargaAndDiskonForRequestType;
  }): Promise<ResponseStructure<ResponseTransactionDetailType | null>> {
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseTransactionDetailType | null>
    >(`/transaction-detail/${params.transactionDetailId}`, params.req);

    return result.data;
  }
}
