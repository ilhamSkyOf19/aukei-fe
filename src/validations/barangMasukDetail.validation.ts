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
        .number("Mohon isi jumlah box")
        .int()
        .positive()
        .min(1, "Mohon isi jumlah box")
        .max(2147483647),
    })
    .strict() satisfies z.ZodType<CreateBarangMasukDetailType>;

  // update barang masuk detail
  static readonly UPDATE = z
    .object({
      produkId: z.number().int().positive().max(2147483647).optional(),
      jumlahBox: z.number().int().max(2147483647).optional(),
    })
    .strict() satisfies z.ZodType<UpdateBarangMasukDetailType>;
}
