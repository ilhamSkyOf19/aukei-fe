import z from "zod";

export class PengajuanBarangValidations {
  // keterangan
  static readonly KETERANGAN = z
    .object({
      keterangan: z
        .string("keterangan harap diisi")
        .min(1, "keterangan harap diisi")
        .max(300, "keterangan maksimal 300 karakter"),
    })
    .strict() satisfies z.ZodType<{ keterangan: string }>;
}
