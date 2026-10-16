import instanceAxios from "../libs/axios";
import type { ResponseTransactionPaymentOldType } from "../models/transactionPaymentOld.model";
import type { ResponseStructure } from "../types/response.type";

export class TransactionPaymentOldServices {
  static async create(params: {
    transactionId: number;
  }): Promise<ResponseStructure<ResponseTransactionPaymentOldType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTransactionPaymentOldType | null>
    >(`/transaction-payment-old/${params.transactionId}`);

    return result.data;
  }

  static async delete(params: {
    transactionId: number;
  }): Promise<ResponseStructure<null>> {
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/transaction-payment-old/${params.transactionId}`,
    );

    return result.data;
  }
}
