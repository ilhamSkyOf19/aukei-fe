import type { RoleInternalType } from "../types/constant.type";

// Pengguna
export interface IPenggunaInternalType {
  id: number;
  nama: string;
  username: string;
  password: string;
  role: RoleInternalType;
  createdAt: Date;
  updatedAt: Date;
}

// create pengguna
export interface CreatePenggunaInternalType extends Omit<
  IPenggunaInternalType,
  "id" | "createdAt" | "updatedAt" | "role"
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

// to response payload
export const toResponsePenggunaInternal = (
  pengguna: ResponsePenggunaInternalType,
): ResponsePenggunaInternalType => {
  return {
    id: pengguna.id,
    nama: pengguna.nama,
    username: pengguna.username,
    role: pengguna.role,
  };
};
