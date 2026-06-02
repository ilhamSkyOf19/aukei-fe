import type { RoleInternalType } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

//  register for request
export interface RegisterType extends Omit<
  IPenggunaInternalType,
  "id" | "createdAt" | "updatedAt" | "role"
> {
  role: Exclude<RoleInternalType, "OWNER">;
  confirmPassword: string;
}

// login for request
export interface LoginType extends Pick<IPenggunaInternalType, "password"> {
  identifier: string;
}
