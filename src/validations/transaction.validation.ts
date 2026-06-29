import z from "zod";
import type {
  CreateTransactionForKeranjangType,
  DetailsForCreate,
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
    .strict() satisfies z.ZodType<DetailsForCreate>;

  static readonly CREATE = z
    .object({
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
    .strict() satisfies z.ZodType<{
    details: DetailsForCreate[];
  }>;

  static readonly CREATE_FOR_KERANJANG = z
    .object({
      pelangganId: z.number().int().positive().max(2147483647),
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
    .strict() satisfies z.ZodType<CreateTransactionForKeranjangType>;
}
