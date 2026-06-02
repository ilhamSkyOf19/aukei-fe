import z from "zod";
import type { LoginType, RegisterType } from "../models/auth.model";
import { ROLE_INTERNAL_TYPE } from "../types/constant.type";

export class AuthValidations {
  // only char schema
  private static onlyCharSchema(min: number = 1, max: number = 100) {
    return z
      .string()
      .trim()
      .min(min)
      .max(max)
      .regex(/^[A-Za-z\s.,]+$/);
  }

  // string schema
  private static stringSchema(min: number = 1, max: number = 100) {
    return z.string().trim().min(min).max(max);
  }

  // password schema
  private static passwordSchema(min: number = 6, max: number = 50) {
    return z.string().trim().min(min).max(max);
  }

  // create user schema
  static readonly CREATE = z
    .object({
      nama: this.onlyCharSchema(),
      username: this.stringSchema(),
      password: this.passwordSchema(),
      confirmPassword: this.passwordSchema(),
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
      identifier: this.stringSchema(),
      password: this.passwordSchema(),
    })
    .strict() satisfies z.ZodType<LoginType>;
}
