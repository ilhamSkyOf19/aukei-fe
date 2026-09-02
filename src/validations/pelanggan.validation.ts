import z from "zod";
import type {
  CreatePelangganType,
  UpdatePelangganType,
} from "../models/pelanggan.model";

export class PelangganValidations {
  // only char schema
  private static onlyCharSchema(
    min: number = 1,
    max: number = 100,
    field: string,
  ) {
    return z
      .string(`${field} harap diisi`)
      .trim()
      .min(min, `${field} harap diisi`)
      .max(max, `${field} maksimal ${max} karakter`)
      .regex(/^[A-Za-z\s.,]+$/, `${field} hanya boleh huruf`);
  }

  // nomor whatsapp schema
  private static noWaSchema(field: string) {
    return z
      .string(`${field} harap diisi`)
      .max(15, `${field} maksimal 15 digit`)
      .optional();
  }

  static readonly CREATE = z
    .object({
      nama: this.onlyCharSchema(3, 100, "Nama"),
      noWa: this.noWaSchema("Nomor WhatsApp"),
    })
    .strict() satisfies z.ZodType<CreatePelangganType>;

  static readonly UPDATE = z
    .object({
      nama: this.onlyCharSchema(3, 100, "Nama").optional(),
      noWa: this.noWaSchema("Nomor WhatsApp").optional(),
    })
    .strict() satisfies z.ZodType<UpdatePelangganType>;
}
