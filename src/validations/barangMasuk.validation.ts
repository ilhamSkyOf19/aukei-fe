import { z } from "zod";
import type {
  CreateBarangMasukForRequestType,
  UpdateBarangMasukForRequestType,
} from "../models/barangMasuk.model";

export class BarangMasukValidation {
  static readonly CREATE = z
    .object({
      tanggalMasuk: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggalMasuk harus berupa tanggal valid",
        }),

      keterangan: z.string().trim().max(300).optional(),
    })
    .strict() satisfies z.ZodType<CreateBarangMasukForRequestType>;

  // update
  static readonly UPDATE = z
    .object({
      tanggalMasuk: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggalMasuk harus berupa tanggal valid",
        })
        .optional(),
      keterangan: z.string().trim().max(300).optional(),
    })
    .strict() satisfies z.ZodType<UpdateBarangMasukForRequestType>;
}
