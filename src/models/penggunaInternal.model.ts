import type { RoleInternalType } from "../types/constant.type";

// Pengguna
export interface IPenggunaInternalType {
  id: number;
  nama: string;
  username: string;
  password: string;
  isActive: boolean;
  email?: string | null;
  role: RoleInternalType;
  createdAt: Date;
  updatedAt: Date;
}
// payload pengguna
export interface PayloadPenggunaInternalType extends Omit<
  IPenggunaInternalType,
  "password" | "createdAt" | "updatedAt"
> {}

// update password
export interface UpdatePasswordType {
  password: string;
}

export interface UpdateDataPenggunaType {
  username: string;
  nama: string;
  email: string;
}
