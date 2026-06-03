import z from "zod";
import type {
  CreateProdukType,
  UpdateProdukType,
} from "../models/produk.model";
import { MAX_FILE_SIZE_IMG } from "../types/constant.type";

export class ProdukValidation {
  private static stringSchema(min: number = 1, max: number = 100) {
    return z.string().trim().min(min).max(max);
  }

  private static numberSchema() {
    return z.number().int().min(0);
  }

  //   file shcmea
  private static imgSchema = z
    .instanceof(File, { message: "Foto harus diisi" })
    .refine((file) => file.size <= MAX_FILE_SIZE_IMG, {
      message: "Maksimal ukuran file 10 MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Format file tidak valid",
      },
    );

  static readonly CREATE = z
    .object({
      kategoriId: z.number().int().positive().max(2147483647),

      nama: this.stringSchema(3, 150),

      kode: this.stringSchema(3, 50),

      hargaBeli: this.numberSchema(),

      hargaJual: this.numberSchema(),

      stok: this.numberSchema(),

      isiPerBox: z.number().int().positive(),

      stokMinimum: this.numberSchema(),

      img: this.imgSchema,
    })
    .strict() satisfies z.ZodType<CreateProdukType>;

  static readonly UPDATE = z
    .object({
      kategoriId: z.number().int().positive().optional(),

      nama: this.stringSchema(3, 150).optional(),

      kode: this.stringSchema(3, 50).optional(),

      hargaBeli: this.numberSchema().optional(),

      hargaJual: this.numberSchema().optional(),

      stok: this.numberSchema().optional(),

      isiPerBox: z.number().int().positive().optional(),

      stokMinimum: this.numberSchema().optional(),

      img: this.imgSchema.optional(),
    })
    .strict() satisfies z.ZodType<UpdateProdukType>;
}
