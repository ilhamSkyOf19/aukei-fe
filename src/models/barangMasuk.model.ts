import type { MetaType, StatusInventoriType } from "../types/constant.type";
import type { IBarangMasukDetailType } from "./barangMasukDetail.model";

export interface IBarangMasukType {
  id: number;
  kodeReferensi: string;
  tanggalMasuk: Date;
  keterangan: string | null;
  status: StatusInventoriType;
  detailBarangMasuks: Omit<IBarangMasukDetailType, "barangMasukId">[];
  createdAt: Date;
  updatedAt: Date;
}

// create rquest
export interface CreateBarangMasukForRequestType {
  tanggalMasuk: string;
  keterangan?: string;
}

// updatfe rquest
export interface UpdateBarangMasukForRequestType extends Partial<CreateBarangMasukForRequestType> {}

// response
export interface ResponseBarangMasukType extends Omit<
  IBarangMasukType,
  "detailBarangMasuks"
> {}

// to response
export const toResponseBarangMasuk = (
  barangMasuk: ResponseBarangMasukType,
): ResponseBarangMasukType => barangMasuk;

// response with meta
export interface ResponseBarangMasukWithMetaType {
  data: (ResponseBarangMasukType & {
    countDetailBarangMasuk: number;
  })[];
  meta: MetaType;
}

// find by id
export interface ResponseBarangMasukWithDetailType extends ResponseBarangMasukType {
  detailBarangMasuks: Omit<IBarangMasukDetailType, "barangMasukId">[];
}

// to response detail
export const toResponseBarangMasukWithDetail = (
  barangMasuk: ResponseBarangMasukWithDetailType,
): ResponseBarangMasukWithDetailType => barangMasuk;

// posted for service
export interface PostedBarangMasukForServiceType {
  barangMasukId: number;
  produks: {
    id: number;
    stok: number;
  }[];
}
