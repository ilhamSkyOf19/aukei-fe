import z from "zod";
import type { CreateTempoPaymentType } from "../models/tempoPayment.model";

export class TempoPaymentValidations {
  static readonly PAYMENT = z
    .object({
      nominal: z
        .number("nominal harus diisi")
        .int()
        .min(0, "nominal harus diisi")
        .max(2147483647, "nominal melebihi maksimal"),
      keterangan: z
        .string("keterangan harus string")
        .max(300, "keterangan melebihi maksimal")
        .optional(),
    })
    .strict() satisfies z.ZodType<
    Pick<CreateTempoPaymentType, "nominal" | "keterangan">
  >;
}
