import { z } from "zod";
import type {
  CreateBarangKeluarForRequestType,
  UpdateBarangKeluarForRequestType,
} from "../models/barangKeluar.model";

export class BarangKeluarValidation {
  static readonly CREATE = z
    .object({
      tanggalKeluar: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggalkeluar harus berupa tanggal valid",
        }),

      keterangan: z.string().trim().max(300).optional(),
      jenisKeluarId: z.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<CreateBarangKeluarForRequestType>;

  // update
  static readonly UPDATE = z
    .object({
      tanggalKeluar: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggalkeluar harus berupa tanggal valid",
        })
        .optional(),

      keterangan: z.string().trim().max(300).optional(),
      jenisKeluarId: z.number().int().positive().max(2147483647).optional(),
    })
    .strict() satisfies z.ZodType<UpdateBarangKeluarForRequestType>;
}
