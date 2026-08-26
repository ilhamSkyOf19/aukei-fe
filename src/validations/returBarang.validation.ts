import z from "zod";
import type { UpdateReturnDetailRequestType } from "../models/returBarang.model";

export class ReturBarangValidations {
  // static readonly CREATE = z
  //   .object({
  //     customTotalRefund: z
  //       .number("customTotalRefund wajib diisi")
  //       .int()
  //       .min(0)
  //       .optional(),

  //     keterangan: z.string("keterangan wajib diisi").max(300).optional(),
  //     details: z
  //       .array(
  //         z
  //           .object({
  //             transactionDetailId: z
  //               .number("transactionDetailId wajib diisi")
  //               .int()
  //               .positive(),

  //             nama: z.string("nama wajib diisi").min(1),

  //             kode: z.string("kode wajib diisi").min(1),

  //             img: z.string("img wajib diisi").min(1),

  //             maxQuantity: z.number("hargaJual wajib diisi").int().min(0),

  //             hargaJual: z.number("hargaJual wajib diisi").int().min(0),

  //             quantityGood: z.number("quantityGood wajib diisi").int().min(0),

  //             quantityDamaged: z
  //               .number("quantityDamaged wajib diisi")
  //               .int()
  //               .min(0),
  //           })
  //           .strict()
  //           .superRefine((value, ctx) => {
  //             if (value.quantityGood + value.quantityDamaged <= 0) {
  //               ctx.addIssue({
  //                 code: "custom",
  //                 path: ["quantityGood"],
  //                 message: "harap diisi.",
  //               });
  //               ctx.addIssue({
  //                 code: "custom",
  //                 path: ["quantityDamaged"],
  //                 message: "harap diisi.",
  //               });
  //             }
  //           }),
  //       )
  //       .min(1, "Minimal harus terdapat 1 detail return."),
  //   })
  //   .strict() satisfies z.ZodType<CreateReturnRequestType>;

  static readonly KETERANGAN = z
    .object({
      keterangan: z
        .string("keterangan harap diisi")
        .min(1, "keterangan harap diisi")
        .max(300, "keterangan maksimal 300 karakter"),
    })
    .strict() satisfies z.ZodType<{ keterangan: string }>;

  static readonly KETERANGAN_PENGAJUAN = z
    .object({
      keterangan: z
        .string("keterangan harap diisi")
        .min(1, "keterangan harap diisi")
        .max(300, "keterangan maksimal 300 karakter")
        .optional(),
    })
    .strict() satisfies z.ZodType<{ keterangan?: string }>;

  /**
   * ============================================================
   * UPDATE RETURN DETAIL
   * ============================================================
   *
   * Digunakan untuk update:
   * - hargaBeliRetur
   * - quantityReturn
   * - totalRefund
   *
   * Semua field wajib dikirim.
   *
   * Nilai 0 tetap valid.
   */
  static readonly UPDATE_DETAIL = z
    .object({
      hargaBeliRetur: z
        .number("hargaBeliRetur wajib diisi")
        .int()
        .min(0, "hargaBeliRetur tidak boleh kurang dari 0"),

      quantityReturn: z
        .number("quantityReturn wajib diisi")
        .int()
        .min(0, "quantityReturn tidak boleh kurang dari 0"),

      totalRefund: z
        .number("totalRefund wajib diisi")
        .int()
        .min(0, "totalRefund tidak boleh kurang dari 0"),
    })
    .strict() satisfies z.ZodType<UpdateReturnDetailRequestType>;
}
