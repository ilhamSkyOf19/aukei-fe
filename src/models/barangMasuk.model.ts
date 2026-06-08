import type { MetaType, StatusInventoriType } from "../types/constant.type";
import type { IBarangMasukDetailType } from "./barangMasukDetail.model";

export interface IBarangMasukType {
  id: number;
  kodeReferensi: string;
  tanggalMasuk: Date;
  keterangan: string | null;
  status: StatusInventoriType;
  totalNilai: string;
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

// posted for service
export interface PostedBarangMasukForServiceType {
  barangMasukId: number;
  produks: {
    id: number;
    stok: number;
  }[];
}
