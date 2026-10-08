import z from "zod";

export class ActivationCodeValidation {
  static readonly CREATE = z
    .object({
      email: z.email(),
    })
    .strict() satisfies z.ZodType<{ email: string }>;

  // verify
  static readonly VERIFY = z
    .object({
      code: z
        .string("Kode verifikasi harap diisi")
        .refine((val) => val.length === 6, "Kode verifikasi harus 6 digit"),
    })
    .strict() satisfies z.ZodType<{ code: string }>;
}
