import z from "zod";
import type {
  CreateProdukType,
  UpdateProdukType,
} from "../models/produk.model";
import { MAX_FILE_SIZE_IMG } from "../types/constant.type";

export class ProdukValidation {
  private static stringSchema(fieldName: string, max: number = 100) {
    return z
      .string()
      .trim()
      .min(1, `Mohon isi ${fieldName}`)
      .max(max, `Maksimal ${max} karakter`);
  }

  private static numberSchema(fieldName: string) {
    return z.number(`Mohon isi ${fieldName}`).min(0, `Mohon isi ${fieldName}`);
  }

  private static positiveNumberSchema(fieldName: string) {
    return z
      .number(`Mohon isi ${fieldName}`)
      .int()
      .positive(`Mohon isi ${fieldName}`);
  }

  private static imgSchema = z
    .instanceof(File, {
      message: "Mohon pilih foto produk",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE_IMG, {
      message: "Maksimal ukuran file 10 MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Format file harus JPG atau PNG",
      },
    );

  static readonly CREATE = z
    .object({
      kategoriId: this.positiveNumberSchema("kategori"),

      nama: this.stringSchema("nama produk", 150),

      kode: this.stringSchema("kode produk", 50),

      hargaBeli: this.numberSchema("harga beli"),

      hargaJual: this.numberSchema("harga jual"),

      stok: this.numberSchema("stok"),

      isiPerBox: this.positiveNumberSchema("isi per box"),

      stokMinimum: this.numberSchema("stok minimum"),

      img: this.imgSchema,
    })
    .strict() satisfies z.ZodType<CreateProdukType>;

  static readonly UPDATE = z
    .object({
      kategoriId: z.number().int().positive().optional(),

      nama: this.stringSchema("nama produk", 150).optional(),

      kode: this.stringSchema("kode produk", 50).optional(),

      hargaBeli: z
        .number("Mohon isi harga beli")
        .min(0, "Mohon isi harga beli")
        .optional(),

      hargaJual: z
        .number("Mohon isi harga jual")
        .min(0, "Mohon isi harga jual")
        .optional(),

      stok: z.number("Mohon isi stok").optional(),

      isiPerBox: z
        .number("Mohon isi per box")
        .min(0, "Mohon isi per box")
        .optional(),

      stokMinimum: z
        .number("Mohon isi stok minimun")
        .min(0, "Mohon isi stok minimum")
        .optional(),

      img: this.imgSchema.optional(),
    })
    .strict() satisfies z.ZodType<UpdateProdukType>;
}
