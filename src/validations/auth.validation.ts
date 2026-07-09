import z from "zod";
import type { LoginType, RegisterType } from "../models/auth.model";
import { ROLE_INTERNAL_TYPE } from "../types/constant.type";

export class AuthValidations {
  // create
  static readonly CREATE = z
    .object({
      nama: z
        .string("Nama harap diisi")
        .trim()
        .min(1, "Nama harap diisi")
        .max(100, "Nama maksimal 100 karakter"),
      username: z
        .string("Username harap diisi")
        .trim()
        .min(1, "Username harap diisi")
        .max(100, "Username maksimal 100 karakter"),
      password: z
        .string("Password harap diisi")
        .trim()
        .min(1, "Password harap diisi")
        .max(100, "Password maksimal 100 karakter"),
      confirmPassword: z
        .string("Konfirmasi Password harap diisi")
        .trim()
        .min(1, "Konfirmasi Password harap diisi")
        .max(100, "Konfirmasi Password maksimal 100 karakter"),
      role: z.enum([ROLE_INTERNAL_TYPE.KASIR]),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "password tidak sama",
          path: ["confirmPassword"],
        });
      }
    })
    .strict() satisfies z.ZodType<RegisterType>;

  // login
  static readonly LOGIN = z
    .object({
      identifier: z
        .string("Username harap diisi")
        .trim()
        .min(1, "Username harap diisi")
        .max(100, "Username maksimal 100 karakter"),
      password: z
        .string("Password harap diisi")
        .trim()
        .min(1, "Password harap diisi")
        .max(100, "Password maksimal 100 karakter"),
    })
    .strict() satisfies z.ZodType<LoginType>;
}
