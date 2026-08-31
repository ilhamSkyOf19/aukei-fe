import type { MetaType, StatusInventoriType } from "../types/constant.type";
import type { IBarangKeluarDetailType } from "./barangKeluarDetail.model";
import type { IJenisKeluarType } from "./jenisKeluar.model";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

interface IBarangKeluarType {
  id: number;
  kodeReferensi: string;
  tanggalKeluar: Date;
  keterangan: string | null;
  detailBarangKeluars: Omit<IBarangKeluarDetailType, "barangKeluarId">[];
  jenisKeluar: Pick<IJenisKeluarType, "id" | "nama">;
  status: StatusInventoriType;
  totalNilai: number;
  author?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "isActive" | "username"
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

// create
export interface CreateBarangKeluarForServiceType extends Pick<
  IBarangKeluarType,
  "tanggalKeluar"
> {
  kodeReferensi?: string;
  keterangan?: string;
  jenisKeluarId: number;
}

// update
export interface UpdateBarangKeluarForServiceType extends Partial<
  Omit<CreateBarangKeluarForServiceType, "kodeReferensi">
> {}

// response
export interface ResponseBarangKeluarType extends Omit<
  IBarangKeluarType,
  "detailBarangKeluars"
> {}

// to response
export const toResponseBarangKeluar = (
  barangKeluar: ResponseBarangKeluarType,
): ResponseBarangKeluarType => barangKeluar;

// response with meta
export interface ResponseBarangKeluarWithMetaType {
  data: (ResponseBarangKeluarType & {
    tanggalDiajukan?: number;
    countDetailBarangKeluar: number;
  })[];
  meta: MetaType;
}

// find by id
export interface ResponseBarangKeluarWithDetailType extends ResponseBarangKeluarType {
  detailBarangKeluars: Array<
    Omit<IBarangKeluarDetailType, "barangKeluarId"> & {
      stokMinimum?: number;
    }
  >;
  ownerAuthor?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "role"
  > | null;
  tanggalDiajukan?: Date | null;
}

// to response detail
export const toResponseBarangKeluarWithDetail = (
  barangKeluar: ResponseBarangKeluarWithDetailType,
): ResponseBarangKeluarWithDetailType => barangKeluar;

// posted
export interface PostedBarangKeluarForServiceType {
  barangKeluarId: number;
  produks: {
    id: number;
    stok: number;
    barangKeluarDetailId: number;
  }[];
  status: StatusInventoriType;
}
