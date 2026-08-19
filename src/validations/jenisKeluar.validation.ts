import z from "zod";
import type {
  CreateJenisKeluarType,
  UpdateJenisKeluarType,
} from "../models/jenisKeluar.model";

export class JenisKeluarValidation {
  private static stringSchema(min: number = 1, max: number = 100) {
    return z.string().trim().min(min).max(max);
  }

  // create
  static readonly CREATE = z
    .object({
      nama: this.stringSchema(3, 100),
    })
    .strict() satisfies z.ZodType<CreateJenisKeluarType>;

  // update
  static readonly UPDATE = z
    .object({
      nama: this.stringSchema(3, 100).optional(),
    })
    .strict() satisfies z.ZodType<Pick<UpdateJenisKeluarType, "nama">>;
}
