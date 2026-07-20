import instanceAxios from "../libs/axios";
import type {
  CreateTempoPaymentType,
  ResponseTempoPaymentType,
} from "../models/tempoPayment.model";
import type { ResponseStructure } from "../types/response.type";

export class TempoPaymentServices {
  // payment
  static async payment(
    req: CreateTempoPaymentType,
  ): Promise<ResponseStructure<ResponseTempoPaymentType | null>> {
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTempoPaymentType | null>
    >("/tempo-payment", req);

    return result.data;
  }
}
