import z from "zod";

import type {
  CreateStockOpnameDetailArrayType,
  UpdateStockOpnameDetailType,
} from "../models/stockOpnameDetail.model";

import { JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE } from "../types/constant.type";

export class StockOpnameDetailValidation {
  // ============================================================
  // CREATE STOCK OPNAME DETAILS
  // ============================================================

  static readonly CREATE = z
    .object({
      stockOpnameId: z
        .number("Stock opname tidak valid")
        .int()
        .positive("Stock opname tidak valid")
        .max(2147483647),

      details: z
        .array(
          z
            .object({
              produkId: z
                .number("Mohon pilih produk")
                .int()
                .positive("Mohon pilih produk")
                .max(2147483647)
                .min(1, "Mohon pilih produk"),

              stokFisik: z
                .number("Stok Fisik tidak valid")
                .int()
                .min(0, "Stok Fisik tidak boleh kurang dari 0")
                .max(2147483647, "Stok Fisik terlalu besar"),

              selisih: z
                .number("Stok Fisik tidak valid")
                .int()
                .min(0, "Stok Fisik tidak boleh kurang dari 0")
                .max(2147483647, "Stok Fisik terlalu besar"),

              jenisPenyesuaian: z
                .enum(
                  JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE,
                  "Mohon pilih penyesuaian",
                )
                .optional(),

              keteranganPenyesuaian: z
                .string()
                .trim()
                .min(1, "Keterangan penyesuaian tidak boleh kosong")
                .max(300, "Keterangan penyesuaian maksimal 300 karakter")
                .optional(),
            })
            .strict(),
        )
        .min(1, "Minimal satu detail stock opname"),
    })
    .strict() satisfies z.ZodType<CreateStockOpnameDetailArrayType>;

  // ============================================================
  // UPDATE STOCK OPNAME DETAIL
  // ============================================================

  static readonly UPDATE = z
    .object({
      produkId: z
        .number("Produk tidak valid")
        .int()
        .positive("Mohon pilih produk")
        .max(2147483647)
        .optional(),

      stokFisik: z
        .number("Stok Fisik tidak valid")
        .int()
        .min(0, "Stok Fisik tidak boleh kurang dari 0")
        .max(2147483647, "Stok Fisik terlalu besar")
        .optional(),

      jenisPenyesuaian: z.enum(JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE).optional(),

      keteranganPenyesuaian: z
        .string()
        .trim()
        .min(1, "Keterangan penyesuaian tidak boleh kosong")
        .max(300, "Keterangan penyesuaian maksimal 300 karakter")
        .optional(),
    })
    .strict()
    .refine(
      (data) =>
        data.produkId !== undefined ||
        data.stokFisik !== undefined ||
        data.jenisPenyesuaian !== undefined ||
        data.keteranganPenyesuaian !== undefined,
      {
        message: "Minimal satu data harus diubah",
      },
    ) satisfies z.ZodType<UpdateStockOpnameDetailType>;
}
