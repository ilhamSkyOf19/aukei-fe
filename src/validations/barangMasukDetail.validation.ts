import { z } from "zod";
import type {
  CreateBarangMasukDetailType,
  UpdateBarangMasukDetailType,
} from "../models/barangMasukDetail.model";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../types/constant.type";

export class BarangMasukDetailValidation {
  static readonly PARAMS_ID_AND_STATUS = z
    .object({
      id: z.number().int().positive(),
      status: z.enum(STATUS_INVENTORI_TYPE),
    })
    .strict() as z.ZodType<{ id: number; status: StatusInventoriType }>;

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
      jumlahBox: z.number().int().positive().max(2147483647).optional(),
    })
    .strict() satisfies z.ZodType<UpdateBarangMasukDetailType>;
}
