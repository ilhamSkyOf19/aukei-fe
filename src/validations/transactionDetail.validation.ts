import z from "zod";
import type { UpdateHargaAndDiskonAndQuantityForRequestType } from "../models/transactionDetail.model";

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
      quantity: z
        .number("quantity tidak valid")
        .int()
        .max(2147483647, "quantity terlalu besar")
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.hargaJual !== undefined &&
        data.diskon !== undefined &&
        data.quantity !== undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "harga jual dan diskon dan quantity tidak boleh diisi bersamaan",
          path: ["hargaJual"],
        });
        ctx.addIssue({
          code: "custom",
          message:
            "harga jual dan diskon dan quantity tidak boleh diisi bersamaan",
          path: ["diskon"],
        });
        ctx.addIssue({
          code: "custom",
          message:
            "harga jual dan diskon dan quantity tidak boleh diisi bersamaan",
          path: ["quantity"],
        });
      }

      if (
        data.hargaJual === undefined &&
        data.diskon === undefined &&
        data.quantity === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: "harga jual atau diskon atau quantity harus diisi",
          path: ["hargaJual"],
        });
        ctx.addIssue({
          code: "custom",
          message: "harga jual atau diskon atau quantity harus diisi",
          path: ["diskon"],
        });
        ctx.addIssue({
          code: "custom",
          message: "harga jual atau diskon atau quantity harus diisi",
          path: ["quantity"],
        });
      }
    })
    .strict() satisfies z.ZodType<UpdateHargaAndDiskonAndQuantityForRequestType>;
}
