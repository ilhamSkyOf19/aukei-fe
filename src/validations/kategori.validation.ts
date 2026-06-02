import z from "zod";
import type {
  CreateKategoriProdukType,
  UpdateKategoriProdukType,
} from "../models/kategoriProduk.model";

export class KategoriProdukValidations {
  // only char schema
  private static onlyCharSchema(min: number = 1, max: number = 100) {
    return z
      .string()
      .trim()
      .min(min)
      .max(max)
      .regex(/^[A-Za-z0-9\s.,&()-]+$/);
  }

  // string schema
  private static stringSchema(min: number = 1, max: number = 100) {
    return z.string().trim().min(min).max(max);
  }

  // create
  static readonly CREATE = z
    .object({
      nama: this.onlyCharSchema(3, 100),
      keterangan: z.string().max(100).optional(),
    })
    .strict() satisfies z.ZodType<CreateKategoriProdukType>;

  // update
  static readonly UPDATE = z
    .object({
      nama: this.onlyCharSchema(3, 100).optional(),
      keterangan: this.stringSchema(1, 100).optional(),
    })
    .strict() satisfies z.ZodType<UpdateKategoriProdukType>;
}
