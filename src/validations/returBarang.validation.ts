import z from "zod";
import type {
  CreateReturnDetailRequestType,
  CreateReturnRequestType,
} from "../models/returBarang.model";

export class ReturBarangValidations {
  static readonly CREATE = z
    .object({
      customTotalRefund: z
        .number("customTotalRefund wajib diisi")
        .int()
        .min(0)
        .optional(),
      details: z
        .array(
          z
            .object({
              transactionDetailId: z
                .number("transactionDetailId wajib diisi")
                .int()
                .positive(),

              nama: z.string("nama wajib diisi").min(1),

              kode: z.string("kode wajib diisi").min(1),

              img: z.string("img wajib diisi").min(1),

              maxQuantity: z.number("hargaJual wajib diisi").int().min(0),

              hargaJual: z.number("hargaJual wajib diisi").int().min(0),

              quantityGood: z.number("quantityGood wajib diisi").int().min(0),

              quantityDamaged: z
                .number("quantityDamaged wajib diisi")
                .int()
                .min(0),
            })
            .strict()
            .superRefine((value, ctx) => {
              if (value.quantityGood + value.quantityDamaged <= 0) {
                ctx.addIssue({
                  code: "custom",
                  path: ["quantityGood"],
                  message:
                    "Jumlah return harus lebih dari 0 (quantityGood + quantityDamaged).",
                });
              }
            }),
        )
        .min(1, "Minimal harus terdapat 1 detail return."),
    })
    .strict() satisfies z.ZodType<CreateReturnRequestType>;
}
