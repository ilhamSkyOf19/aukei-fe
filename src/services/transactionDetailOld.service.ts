import instanceAxios from "../libs/axios";
import type { ResponseTransactionDetailOldType } from "../models/transactionDetailOld.model";
import type { ResponseStructure } from "../types/response.type";

export class TransactionDetailOldServices {
  static async create(params: {
    transactionId: number;
  }): Promise<ResponseStructure<ResponseTransactionDetailOldType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTransactionDetailOldType | null>
    >(`/transaction-detail-old/${params.transactionId}`);

    return result.data;
  }

  static async delete(params: {
    transactionId: number;
  }): Promise<ResponseStructure<null>> {
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/transaction-detail-old/transaction/${params.transactionId}`,
    );

    return result.data;
  }
}
