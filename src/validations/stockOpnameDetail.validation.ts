import z from "zod";
import type { CreateStockOpnameDetailType } from "../models/stockOpnameDetail.model";

export class StockOpnameDetailValidation {
  static readonly CREATE = z
    .object({
      stockOpnameId: z.number().int().positive().max(2147483647),
      produkId: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .min(1, "Mohon pilih produk"),
      stokFisik: z
        .number("Stok Fisik tidak valid")
        .int()
        .max(2147483647, "Stok Fisik terlalu besar"),
    })
    .strict() satisfies z.ZodType<CreateStockOpnameDetailType>;
}
