import z from "zod";
import type { CreateTempoType } from "../models/tempo.model";

export class TempoValidations {
  private static readonly INT_MAX = 2_147_483_647;

  private static numberSchema(
    fieldName: string,
    min: number = 0,
    max: number = this.INT_MAX,
  ) {
    return z
      .number(`Mohon isi ${fieldName}`)
      .min(min, `${fieldName} minimal ${min}`)
      .max(max, `${fieldName} maksimal ${max.toLocaleString("id-ID")}`);
  }

  private static integerSchema(
    fieldName: string,
    min: number = 1,
    max: number = this.INT_MAX,
  ) {
    return z
      .number(`Mohon isi ${fieldName}`)
      .int(`${fieldName} harus berupa bilangan bulat`)
      .min(min, `${fieldName} minimal ${min}`)
      .max(max, `${fieldName} maksimal ${max.toLocaleString("id-ID")}`);
  }

  static readonly CREATE = z
    .object({
      periode: this.integerSchema("periode", 1, 60),

      jumlahCicilan: this.integerSchema("jumlahCicilan", 1, 12),

      startDate: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggal mulai harus berupa tanggal valid",
        })
        .optional(),

      uangMuka: this.numberSchema("uang muka"),
    })
    .strict() satisfies z.ZodType<CreateTempoType>;
}
