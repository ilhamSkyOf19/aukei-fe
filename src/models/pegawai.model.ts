import type { MetaType, RoleInternalType } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface CreatePegawaiForRequestType extends Pick<
  IPenggunaInternalType,
  "nama" | "password" | "username"
> {
  role: Exclude<RoleInternalType, "OWNER">;
  confirmPassword: string;
}

// update
export interface UpdatePegawaiForRequestType extends Partial<CreatePegawaiForRequestType> {}
// response pegawai
export interface ResponsePegawaiType extends Pick<
  IPenggunaInternalType,
  "id" | "nama" | "username" | "isActive"
> {
  role: Exclude<RoleInternalType, "OWNER">;
}

// response pegawai
export interface ResponsePegawaiWithPaginationType {
  data: ResponsePegawaiType[];
  meta: MetaType;
}
