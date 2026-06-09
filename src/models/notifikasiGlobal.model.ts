import type { INotifikasiProdukType } from "./notifikasiProduk.model";

export interface INotifikasiGlobalType {
  notifikasiProduk: INotifikasiProdukType[];
}

// response
export interface ResponseNotifikasiGlobalType extends INotifikasiGlobalType {}
