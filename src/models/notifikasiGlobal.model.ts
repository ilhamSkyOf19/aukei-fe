import type { INotifikasiProdukType } from "./notifikasiProduk.model";
import type { INotifikasiTempo } from "./notifikasiTempo.model";
import type { ResponsePengajuanBarangType } from "./pengajuanBarang.model";

export interface INotifikasiGlobalType {
  notifikasiProduk: INotifikasiProdukType[];
  notifikasiTempoOverdue: INotifikasiTempo[];
  notifikasiPengajuanBarang: ResponsePengajuanBarangType[];
}

// response
export interface ResponseNotifikasiGlobalType extends INotifikasiGlobalType {}
