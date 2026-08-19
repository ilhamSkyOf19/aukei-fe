import type { MetaType } from "../types/constant.type";
import type { IPelangganType } from "./pelanggan.model";
import type { ITempoInstallmentType } from "./tempoInstallment.model";

// response notifikasi overdue
export interface INotifikasiTempo extends Pick<
  ITempoInstallmentType,
  "cicilanKe" | "jatuhTempo" | "nominal" | "status"
> {
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
  tempoId: number;
}

export interface ResponseNotifikasiTempoWithMetaType {
  data: INotifikasiTempo[];
  meta: MetaType;
}
