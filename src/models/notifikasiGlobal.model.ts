import type { INotifikasiProdukType } from "./notifikasiProduk.model";
import type { INotifikasiTempo } from "./notifikasiTempo.model";
import type { ResponsePengajuanBarangType } from "./pengajuanBarang.model";
import type { ResponseRiwayatPengajuanReturnForHighlightType } from "./riwayatPengajuanReturBarang.model";

export interface INotifikasiGlobalType {
  notifikasiProduk: INotifikasiProdukType[];
  notifikasiTempoOverdue: INotifikasiTempo[];
  notifikasiPengajuanBarang: ResponsePengajuanBarangType[];
  notifikasiPengajuanReturBarang: ResponseRiwayatPengajuanReturnForHighlightType[];
}

// response
export interface ResponseNotifikasiGlobalType extends INotifikasiGlobalType {}
