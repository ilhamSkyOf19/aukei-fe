import z from "zod";
import type {
  CreatePeriodeShadowRequestType,
  UpdatePeriodeShadowRequestType,
} from "../models/periodeShadow.model";

export class PeriodeShadowValidation {
  static readonly CREATE = z
    .object({
      tahun: z
        .number("Tahun harap diisi")
        .int("Tahun harus berupa bilangan bulat")
        .min(2000, "Tahun minimal 2000")
        .max(2100, "Tahun maksimal 2100"),

      nilai: z
        .number("Nilai harap diisi")
        .int("Nilai harus berupa bilangan bulat")
        .nonnegative("Nilai tidak boleh kurang dari 0"),
    })
    .strict() satisfies z.ZodType<CreatePeriodeShadowRequestType>;

  static readonly UPDATE = z
    .object({
      tahun: z
        .number("Tahun harus berupa angka")
        .int("Tahun harus berupa bilangan bulat")
        .min(2000, "Tahun minimal 2000")
        .max(2100, "Tahun maksimal 2100")
        .optional(),

      nilai: z
        .number("Nilai harus berupa angka")
        .int("Nilai harus berupa bilangan bulat")
        .nonnegative("Nilai tidak boleh kurang dari 0")
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdatePeriodeShadowRequestType>;
}
