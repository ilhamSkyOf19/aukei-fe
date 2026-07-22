import z from "zod";
import type { UpdateHargaAndDiskonForRequestType } from "../models/transactionDetail.model";

export class TransactionDetailValidations {
  // update
  static readonly UPDATE = z
    .object({
      hargaJual: z
        .number("harga jual tidak valid")
        .int()
        .max(2147483647, "harga jual terlalu besar")
        .optional(),
      diskon: z
        .number("diskon tidak valid")
        .int()
        .max(2147483647, "diskon terlalu besar")
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.hargaJual !== undefined && data.diskon !== undefined) {
        ctx.addIssue({
          code: "custom",
          message: "harga jual dan diskon tidak boleh diisi bersamaan",
          path: ["hargaJual"],
        });
        ctx.addIssue({
          code: "custom",
          message: "harga jual dan diskon tidak boleh diisi bersamaan",
          path: ["diskon"],
        });
      }

      if (data.hargaJual === undefined && data.diskon === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "harga jual atau diskon harus diisi",
          path: ["hargaJual"],
        });
        ctx.addIssue({
          code: "custom",
          message: "harga jual atau diskon harus diisi",
          path: ["diskon"],
        });
      }
    })
    .strict() satisfies z.ZodType<UpdateHargaAndDiskonForRequestType>;
}
