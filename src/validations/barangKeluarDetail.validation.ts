import { z } from "zod";
import type {
  CreateBarangKeluarDetailType,
  UpdateBarangKeluarDetailType,
} from "../models/barangKeluarDetail.model";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../types/constant.type";

export class BarangKeluarDetailValidation {
  static readonly PARAMS_ID_AND_STATUS = z
    .object({
      id: z.coerce.number("ID tidak valid").int().positive("ID tidak valid"),

      status: z.enum(STATUS_INVENTORI_TYPE, {
        message: "Status tidak valid",
      }),
    })
    .strict() as z.ZodType<{ id: number; status: StatusInventoriType }>;

  // create barang keluar detail
  static readonly CREATE = z
    .object({
      barangKeluarId: z
        .number("Data barang keluar tidak valid")
        .int()
        .positive("Data barang keluar tidak valid")
        .max(2147483647),

      produkId: z
        .number("Mohon pilih produk")
        .int()
        .positive("Mohon pilih produk")
        .max(2147483647),

      jumlahStok: z
        .number("Mohon isi jumlah stok")
        .int()
        .positive("Mohon isi jumlah stok")
        .max(2147483647),

      hargaModalSatuan: z.number("Mohon isi harga modal").int().max(2147483647),
    })
    .strict() satisfies z.ZodType<CreateBarangKeluarDetailType>;

  // update barang keluar detail
  static readonly UPDATE = z
    .object({
      produkId: z
        .number("Mohon pilih produk")
        .int()
        .positive("Mohon pilih produk")
        .max(2147483647)
        .optional(),

      jumlahStok: z
        .number("Mohon isi jumlah stok")
        .int()
        .positive("Mohon isi jumlah stok")
        .max(2147483647)
        .optional(),

      hargaModalSatuan: z
        .number("Mohon isi harga modal")
        .int()
        .max(2147483647)
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdateBarangKeluarDetailType>;
}
