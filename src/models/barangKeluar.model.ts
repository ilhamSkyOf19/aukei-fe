import type { MetaType, StatusInventoriType } from "../types/constant.type";
import type { IBarangKeluarDetailType } from "./barangKeluarDetail.model";
import type { IJenisKeluarType } from "./jenisKeluar.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface IBarangKeluarType {
  id: number;
  kodeReferensi: string;
  tanggalKeluar: Date;
  keterangan: string | null;
  detailBarangKeluars: Omit<IBarangKeluarDetailType, "barangKeluarId">[];
  jenisKeluar: Pick<IJenisKeluarType, "id" | "nama">;
  status: StatusInventoriType;
  totalNilai: string;
  author?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "isActive"
  > | null;
  postedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// create rquest
export interface CreateBarangKeluarForRequestType {
  tanggalKeluar: string;
  keterangan?: string;
  jenisKeluarId: number;
}

// updatfe rquest2
export interface UpdateBarangKeluarForRequestType extends Partial<CreateBarangKeluarForRequestType> {}

// response
export interface ResponseBarangKeluarType extends Omit<
  IBarangKeluarType,
  "detailBarangKeluars"
> {}

// response with meta
export interface ResponseBarangKeluarWithMetaType {
  data: (ResponseBarangKeluarType & {
    countDetailBarangKeluar: number;
    tanggalDiajukan?: Date | null;
  })[];
  meta: MetaType;
}

// find by id
export interface ResponseBarangKeluarWithDetailType extends ResponseBarangKeluarType {
  detailBarangKeluars: Omit<IBarangKeluarDetailType, "barangKeluarId">[];
  tanggalDiajukan?: Date | null;
}
