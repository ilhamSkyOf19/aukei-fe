import { z } from "zod";
import type {
  CreateBarangMasukDetailType,
  UpdateBarangMasukDetailType,
} from "../models/barangMasukDetail.model";

export class BarangMasukDetailValidation {
  // create barang masuk detail
  static readonly CREATE = z
    .object({
      barangMasukId: z.number().int().positive().max(2147483647),

      produkId: z
        .array(
          z.number().int().positive().max(2147483647),
          "Mohon pilih produk",
        )
        .min(1, "Mohon pilih produk"),

      jumlahBox: z
        .number("Jumlah box tidak valid")
        .int()
        .min(1, "Mohon isi jumlah box")
        .max(2147483647)
        .optional(),

      jumlahStok: z
        .number("Jumlah stok tidak valid")
        .int()
        .min(1, "Mohon isi jumlah stok")
        .max(2147483647)
        .optional(),

      hargaBeli: z
        .number("Harga Beli tidak valid")
        .int()
        .max(2147483647, "Harga Beli terlalu besar")
        .optional(),
    })
    .superRefine((data, ctx) => {
      const hasJumlahBox = data.jumlahBox !== undefined;
      const hasJumlahStok = data.jumlahStok !== undefined;

      // Keduanya diisi
      if (hasJumlahBox && hasJumlahStok) {
        ctx.addIssue({
          code: "custom",
          path: ["jumlahBox"],
          message: "Jumlah box dan jumlah item tidak boleh diisi bersamaan",
        });

        ctx.addIssue({
          code: "custom",
          path: ["jumlahStok"],
          message: "Jumlah box dan jumlah item tidak boleh diisi bersamaan",
        });
      }

      // Keduanya kosong
      if (!hasJumlahBox && !hasJumlahStok) {
        ctx.addIssue({
          code: "custom",
          path: ["jumlahBox"],
          message: "Jumlah box atau jumlah item wajib diisi",
        });

        ctx.addIssue({
          code: "custom",
          path: ["jumlahStok"],
          message: "Jumlah box atau jumlah item wajib diisi",
        });
      }
    })
    .strict() satisfies z.ZodType<CreateBarangMasukDetailType>;

  // update barang masuk detail
  static readonly UPDATE = z
    .object({
      produkId: z.number().int().positive().max(2147483647).optional(),

      hargaBeli: z
        .number("Harga Beli tidak valid")
        .int()
        .max(2147483647, "Harga Beli terlalu besar")
        .optional(),

      jumlahBox: z
        .number("Jumlah box tidak valid")
        .int()
        .positive("Jumlah box harus lebih dari 0")
        .max(2147483647, "Jumlah box terlalu besar")
        .optional(),

      jumlahStok: z
        .number("Jumlah stok tidak valid")
        .int()
        .positive("Jumlah stok harus lebih dari 0")
        .max(2147483647, "Jumlah stok terlalu besar")
        .optional(),
    })
    .superRefine((data, ctx) => {
      const hasJumlahBox = data.jumlahBox !== undefined;

      const hasJumlahStok = data.jumlahStok !== undefined;

      if (hasJumlahBox && hasJumlahStok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlahBox"],
          message: "Jumlah box dan jumlah stok tidak boleh diisi bersamaan",
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jumlahStok"],
          message: "Jumlah box dan jumlah stok tidak boleh diisi bersamaan",
        });
      }
    })
    .strict() satisfies z.ZodType<UpdateBarangMasukDetailType>;
}
