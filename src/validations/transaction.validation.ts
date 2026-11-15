import z from "zod";
import type {
  DetailsForCreate,
  RequestUpdateUangMukaBookingType,
} from "../models/transaction.model";
import { PAYMENT_METHOD_TYPE } from "../types/constant.type";

export class TransactionValidation {
  private static numberSchema(
    fieldName: string,
    min: number = 0,
    max: number = 2147483647,
  ) {
    return z
      .number(`Mohon isi ${fieldName}`)
      .min(min, `Mohon isi ${fieldName}`)
      .max(max, `Mohon isi ${fieldName}`);
  }

  // detail
  static readonly DETAILS = z
    .object({
      produkId: this.numberSchema("produk", 1, 2147483647),
      diskon: this.numberSchema("diskon", 0, 2147483647),
      diskonPersen: this.numberSchema(
        "diskon persen",
        0,
        2147483647,
      ).optional(),
      hargaJual: this.numberSchema("harga jual", 0, 2147483647),
      quantity: this.numberSchema("quantity", 1, 2147483647),
    })
    .strict() satisfies z.ZodType<DetailsForCreate>;

  // detail
  static readonly NAMA = z
    .object({
      nama: z.string("Nama harus di isi").min(1, "Nama minimal 1 huruf"),
    })
    .strict() satisfies z.ZodType<{ nama: string }>;

  static readonly UPDATE_UANG_MUKA_BOOKING = z
    .object({
      uangMuka: this.numberSchema("uang muka", 0, 2147483647),
      metodePembayaran: z
        .enum([
          PAYMENT_METHOD_TYPE.CASH,
          PAYMENT_METHOD_TYPE.QRIS,
          PAYMENT_METHOD_TYPE.TRANSFER,
          PAYMENT_METHOD_TYPE.TEMPO,
        ])
        .optional(),
    })
    .strict() satisfies z.ZodType<
    Pick<RequestUpdateUangMukaBookingType, "metodePembayaran" | "uangMuka">
  >;
}
