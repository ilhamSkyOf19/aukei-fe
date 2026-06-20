import z from "zod";
import type {
  CreatePegawaiForRequestType,
  UpdatePegawaiForRequestType,
} from "../models/pegawai.model";
import { ROLE_INTERNAL_TYPE } from "../types/constant.type";

export class PegawaiValidations {
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

  // string schema
  // string schema
  private static stringSchema(
    field: string,
    min: number = 1,
    max: number = 100,
  ) {
    return z
      .string(`${field} harap diisi`)
      .trim()
      .min(min, `${field} harap diisi`)
      .max(max, `${field} maksimal ${max} karakter`);
  }

  // password schema
  private static passwordSchema(
    field: string,
    min: number = 6,
    max: number = 50,
  ) {
    return z
      .string(`${field} harap diisi`)
      .trim()
      .min(min, `${field} minimal ${min} karakter`)
      .max(max, `${field} maksimal ${max} karakter`);
  }

  static readonly CREATE = z
    .object({
      nama: this.onlyCharSchema(1, 100, "Nama"),
      username: this.stringSchema("Username"),
      password: this.passwordSchema("Password"),
      confirmPassword: this.passwordSchema("Konfirmasi Password"),
      role: z.enum([ROLE_INTERNAL_TYPE.KASIR], {
        message: "Role harap diisi",
      }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Password dan konfirmasi password tidak sama",
          path: ["password"],
        });
        ctx.addIssue({
          code: "custom",
          message: "Password dan konfirmasi password tidak sama",
          path: ["confirmPassword"],
        });
      }
    })
    .strict() satisfies z.ZodType<CreatePegawaiForRequestType>;

  static readonly UPDATE = z
    .object({
      nama: this.onlyCharSchema(1, 100, "Nama").optional(),
      username: this.stringSchema("Username").optional(),
      password: z
        .string()
        .trim()
        .min(6, "Password minimal 6 karakter")
        .or(z.literal(""))
        .optional(),

      confirmPassword: z
        .string()
        .trim()
        .min(6, "Konfirmasi Password minimal 6 karakter")
        .or(z.literal(""))
        .optional(),
      role: z
        .enum([ROLE_INTERNAL_TYPE.KASIR], {
          message: "Role harap diisi",
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      const hasPassword = !!data.password;
      const hasConfirmPassword = !!data.confirmPassword;

      if (hasPassword && !hasConfirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Konfirmasi password harap diisi",
          path: ["confirmPassword"],
        });
      }

      if (!hasPassword && hasConfirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Password harap diisi",
          path: ["password"],
        });
      }

      if (
        hasPassword &&
        hasConfirmPassword &&
        data.password !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Password dan konfirmasi password tidak sama",
          path: ["confirmPassword"],
        });
      }
    })
    .strict() satisfies z.ZodType<UpdatePegawaiForRequestType>;
}
