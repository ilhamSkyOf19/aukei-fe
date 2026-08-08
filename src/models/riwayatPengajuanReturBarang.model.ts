import type { MetaType, ReturnStatus } from "../types/constant.type";
import type { IPenggunaInternalType } from "./penggunaInternal.model";

export interface CreateRiwayatPengajuanReturnType {
  keterangan: string;
  authorId: number;
  returnTransactionId: number;
  status: ReturnStatus;
}

// response
export interface ResponseRiwayatPengajuanReturnType {
  id: number;
  returnTransactionId: number;
  author: Pick<IPenggunaInternalType, "id" | "nama" | "role">;
  status: ReturnStatus;
  createdAt: Date;
  updatedAt: Date;
  keterangan: string;
}

// response with meta type
export interface ResponseRiwayatPengajuanReturnWithMetaType {
  data: Array<ResponseRiwayatPengajuanReturnType>;
  meta: MetaType;
}

export interface ResponseRiwayatPengajuanReturnForHighlightType extends ResponseRiwayatPengajuanReturnType {
  pelangganId: number;
  transactionId: number;
}
