import z from "zod";
import type { CreateShadowFeatureType } from "../models/shadowFeature.model";

export class ShadowFeatureValidation {
  // =========================================================
  // CREATE SHADOW TRANSACTION BY PERIOD
  // =========================================================

  static readonly CREATE = z
    .object({
      nama: z
        .string()
        .trim()
        .max(100, `Maksimal ${100} karakter`)
        .transform((value) => (value === "" ? undefined : value))
        .nullable()
        .optional(),
      nilai: z
        .number("Nilai harap diisi")
        .int("Nilai harap diisi")
        .positive("Nilai harap diisi")
        .max(2147483647, "Nilai maksimal 2147483647"),
    })
    .strict() satisfies z.ZodType<CreateShadowFeatureType>;

  // update is active
}
