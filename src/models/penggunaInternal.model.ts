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

// create pengguna
export interface CreatePenggunaInternalType extends Omit<
  IPenggunaInternalType,
  "id" | "createdAt" | "updatedAt" | "role" | "isActive"
> {
  role: RoleInternalType;
}

// payload pengguna
export interface PayloadPenggunaInternalType extends Omit<
  IPenggunaInternalType,
  "password" | "createdAt" | "updatedAt"
> {}

// response pengguna
export interface ResponsePenggunaInternalType extends Omit<
  IPenggunaInternalType,
  "password" | "createdAt" | "updatedAt"
> {}
