import { z } from "zod";
import type {
  CreateBarangKeluarForRequestType,
  UpdateBarangKeluarForRequestType,
} from "../models/barangKeluar.model";

export class BarangKeluarValidation {
  static readonly CREATE = z
    .object({
      tanggalKeluar: z
        .string({
          message: "Mohon pilih tanggal keluar",
        })
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "Tanggal keluar tidak valid",
        }),

      keterangan: z
        .string()
        .trim()
        .max(300, "Keterangan maksimal 300 karakter")
        .optional(),

      jenisKeluarId: z
        .number("Mohon pilih jenis keluar")
        .int()
        .positive("Mohon pilih jenis keluar")
        .max(2147483647),
    })
    .strict() satisfies z.ZodType<CreateBarangKeluarForRequestType>;

  // update
  static readonly UPDATE = z
    .object({
      tanggalKeluar: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "Tanggal keluar tidak valid",
        })
        .optional(),

      keterangan: z
        .string()
        .trim()
        .max(300, "Keterangan maksimal 300 karakter")
        .optional(),

      jenisKeluarId: z
        .number("Mohon pilih jenis keluar")
        .int()
        .positive("Mohon pilih jenis keluar")
        .max(2147483647)
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdateBarangKeluarForRequestType>;
}
