import type { MetaType } from "../types/constant.type";
import type { ResponsePengajuanBarangType } from "./pengajuanBarang.model";

export interface INotifikasiPengajuanBarangWithMetaType {
  data: Pick<
    ResponsePengajuanBarangType,
    | "author"
    | "barangKeluarId"
    | "barangMasukId"
    | "updatedAt"
    | "keterangan"
    | "status"
    | "id"
  >[];
  meta: MetaType;
}
