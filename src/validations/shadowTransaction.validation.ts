import z from "zod";
import type { CreateShadowTransactionType } from "../models/shadowTransaction.model";

export class ShadowTransactionValidation {
  // =========================================================
  // CREATE SHADOW TRANSACTION BY PERIOD
  // =========================================================

  static readonly CREATE = z
    .object({
      startDate: z
        .string("tanggal mulai tidak valid")
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggal mulai harus berupa tanggal valid",
        }),

      endDate: z
        .string("tanggal selesai tidak valid")
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggal selesai harus berupa tanggal valid",
        }),
    })
    .strict()
    .refine((data) => data.startDate <= data.endDate, {
      message: "startDate tidak boleh lebih besar dari endDate",
      path: ["startDate"],
    }) satisfies z.ZodType<
    Pick<CreateShadowTransactionType, "startDate" | "endDate">
  >;
}
