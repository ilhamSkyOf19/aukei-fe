import z from "zod";
import type {
  CreateKategoriProdukType,
  UpdateKategoriProdukType,
} from "../models/kategoriProduk.model";

export class KategoriProdukValidations {
  // only char schema
  private static onlyCharSchema(
    name: string,
    min: number = 1,
    max: number = 100,
  ) {
    return z
      .string(`${name} harap diisi`)
      .trim()
      .min(min, `${name} harap diisi`)
      .max(max, `${name} maksimal ${max} karakter`)
      .regex(/^[A-Za-z0-9\s.,&()-]+$/, `${name} tidak valid`);
  }

  // string schema
  private static stringSchema(
    name: string,
    min: number = 1,
    max: number = 100,
  ) {
    return z
      .string(`${name} harap diisi`)
      .trim()
      .min(min, `${name} harap diisi`)
      .max(max, `${name} maksimal ${max} karakter`);
  }

  // create
  static readonly CREATE = z
    .object({
      nama: this.onlyCharSchema("nama kategori", 3, 100),
      keterangan: this.stringSchema("keterangan", 0, 100).optional(),
    })
    .strict() satisfies z.ZodType<CreateKategoriProdukType>;

  // update
  static readonly UPDATE = z
    .object({
      nama: this.onlyCharSchema("nama kategori", 3, 100).optional(),
      keterangan: this.stringSchema("keterangan", 0, 100).optional(),
    })
    .strict() satisfies z.ZodType<UpdateKategoriProdukType>;
}
