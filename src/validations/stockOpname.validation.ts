import { z } from "zod";
import type {
  CreateStockOpnameForRequestType,
  UpdateStockOpnameForRequestType,
} from "../models/stockOpname.model";

export class StockOpnameValidation {
  static readonly CREATE = z
    .object({
      tanggalOpname: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggalOpname harus berupa tanggal valid",
        }),

      keterangan: z.string().trim().max(300).optional(),
    })
    .strict() satisfies z.ZodType<CreateStockOpnameForRequestType>;

  static readonly UPDATE = z
    .object({
      tanggalOpname: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "tanggalOpname harus berupa tanggal valid",
        })
        .optional(),

      keterangan: z.string().trim().max(300).optional(),
    })
    .strict() satisfies z.ZodType<UpdateStockOpnameForRequestType>;
}
