import z from "zod";
import type { ITransactionDetailType } from "../models/transactionDetail.model";
import { PAYMENT_METHOD_TYPE } from "../types/constant.type";
import type {
  CreateTransactionForRequestType,
  UpdateTransactionForRequestType,
} from "../models/transaction.model";

export class TransactionValidation {
  private static numberSchema(
    fieldName: string,
    min: number = 0,
    max: number = 2147483647,
  ) {
    return z
      .number(`Mohon isi ${fieldName}`)
      .min(min, `Mohon isi ${fieldName}`)
      .max(max, `Mohon isi ${fieldName}`);
  }

  private static readonly detailsSchema = z
    .object({
      produkId: this.numberSchema("produk", 1, 2147483647),
      diskon: this.numberSchema("diskon", 0, 2147483647),
      hargaJual: this.numberSchema("harga jual", 0, 2147483647),
      quantity: this.numberSchema("quantity", 1, 2147483647),
    })
    .strict() satisfies z.ZodType<
    Pick<ITransactionDetailType, "diskon" | "hargaJual" | "quantity"> & {
      produkId: number;
    }
  >;

  private static readonly detailsSchemaWithId = z
    .object({
      id: this.numberSchema("id", 1, 2147483647).optional(),
      produkId: this.numberSchema("produk", 1, 2147483647),
      diskon: z.number().int().max(2147483647),
      hargaJual: z.number().int().max(2147483647),
      quantity: z.number().int().max(2147483647),
    })
    .strict() satisfies z.ZodType<
    Pick<ITransactionDetailType, "diskon" | "hargaJual" | "quantity"> & {
      id?: number;
      produkId: number;
    }
  >;

  // create
  static readonly CREATE = z
    .object({
      pelangganId: this.numberSchema("pelanggan", 1, 2147483647),
      metodePembayaran: z.enum(PAYMENT_METHOD_TYPE, {
        message: "Metode pembayaran mohon diisi",
      }),
      details: z.array(this.detailsSchema).min(1),
    })
    .superRefine((data, ctx) => {
      // check details produk id
      const produkIds = data.details.map((detail) => detail.produkId);
      if (produkIds.length !== new Set(produkIds).size) {
        ctx.addIssue({
          code: "custom",
          message: "produk id tidak boleh sama",
          path: ["details"],
        });
      }
    })
    .strict() satisfies z.ZodType<CreateTransactionForRequestType>;

  // update
  static readonly UPDATE = z
    .object({
      pelangganId: this.numberSchema("pelanggan", 1, 2147483647).optional(),
      metodePembayaran: z.enum(PAYMENT_METHOD_TYPE).optional(),
      details: z.array(this.detailsSchemaWithId).optional(),
    })
    .superRefine((data, ctx) => {
      // check details produk id
      if (data.details && data.details.length > 0) {
        const produkIds = data.details.map((detail) => detail.produkId);
        if (produkIds.length !== new Set(produkIds).size) {
          ctx.addIssue({
            code: "custom",
            message: "produk id tidak boleh sama",
            path: ["details"],
          });
        }
      }
    })
    .strict() satisfies z.ZodType<UpdateTransactionForRequestType>;
}
