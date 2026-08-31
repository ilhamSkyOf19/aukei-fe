import z from "zod";
import type {
  CreateStockOpnameDetailType,
  UpdateStockOpnameDetailType,
} from "../models/stockOpnameDetail.model";
import { JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE } from "../types/constant.type";

export class StockOpnameDetailValidation {
  static readonly CREATE = z
    .object({
      stockOpnameId: z.number().int().positive().max(2147483647),
      produkId: z
        .number()
        .int()
        .positive("Mohon pilih produk")
        .max(2147483647)
        .min(1, "Mohon pilih produk"),
      stokFisik: z
        .number("Stok Fisik tidak valid")
        .int()
        .max(2147483647, "Stok Fisik terlalu besar"),
      jenisPenyesuaian: z
        .enum(JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE, "Mohon pilih penyesuaian")
        .optional(),
    })
    .strict() satisfies z.ZodType<CreateStockOpnameDetailType>;

  static readonly UPDATE = z
    .object({
      produkId: z
        .number()
        .int()
        .max(2147483647)
        .min(1, "Mohon pilih produk")
        .optional(),
      stokFisik: z
        .number("Stok Fisik tidak valid")
        .int()
        .max(2147483647, "Stok Fisik terlalu besar")
        .optional(),
      jenisPenyesuaian: z.enum(JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE).optional(),
    })
    .strict() satisfies z.ZodType<UpdateStockOpnameDetailType>;
}
