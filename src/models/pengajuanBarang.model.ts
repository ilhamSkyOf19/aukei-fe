import type { MetaType, StatusInventoriType } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface ResponsePengajuanBarangType {
  id: number;
  keterangan: string;
  author: Pick<IPenggunaInternalType, "id" | "nama" | "username" | "role">;
  barangMasukId?: number | null;
  barangKeluarId?: number | null;
  status: StatusInventoriType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponsePengajuanBarangWithMetaType {
  data: Omit<ResponsePengajuanBarangType, "barangMasukId" | "barangKeluarId">[];
  meta: MetaType;
}
