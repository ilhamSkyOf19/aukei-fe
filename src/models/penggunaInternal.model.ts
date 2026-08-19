import type { RoleInternalType } from "../types/constant.type";

// Pengguna
export interface IPenggunaInternalType {
  id: number;
  nama: string;
  username: string;
  password: string;
  isActive: boolean;
  role: RoleInternalType;
  createdAt: Date;
  updatedAt: Date;
}
// payload pengguna
export interface PayloadPenggunaInternalType extends Omit<
  IPenggunaInternalType,
  "password" | "createdAt" | "updatedAt"
> {}
