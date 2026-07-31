import instanceAxios from "../libs/axios";
import type { ResponseNotifikasiGlobalType } from "../models/notifikasiGlobal.model";
import type { INotifikasiPengajuanBarangWithMetaType } from "../models/notifikasiPengajuanBarang.model";
import type { ResponseNotifikasiProdukWithMetaType } from "../models/notifikasiProduk.model";
import type {
  INotifikasiTempo,
  ResponseNotifikasiTempoWithMetaType,
} from "../models/notifikasiTempo.model";
import type { PaginationType } from "../models/pagination.model";
import type { ResponseStructure } from "../types/response.type";

export class NotifikasiGlobalServices {
  // find all
  static async findAll(): Promise<
    ResponseStructure<ResponseNotifikasiGlobalType | null>
  > {
    // call api
    const result =
      await instanceAxios.get<
        ResponseStructure<ResponseNotifikasiGlobalType | null>
      >("/notifikasi-global");

    return result.data;
  }

  //   find notifikasi produk
  static async findNotifikasiProduk(
    query: PaginationType,
  ): Promise<ResponseStructure<ResponseNotifikasiProdukWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseNotifikasiProdukWithMetaType | null>
    >("/notifikasi-global/produk", { params: query });

    return result.data;
  }

  //   find notifikasi tempo
  static async findNotifikasiTempo(
    query: PaginationType,
  ): Promise<ResponseStructure<ResponseNotifikasiTempoWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseNotifikasiTempoWithMetaType | null>
    >("/notifikasi-global/tempo", { params: query });

    return result.data;
  }

  //   find notifikasi pengajuan barang
  static async findNotifikasiPengajuanBarang(
    query: PaginationType,
  ): Promise<ResponseStructure<INotifikasiPengajuanBarangWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<INotifikasiPengajuanBarangWithMetaType | null>
    >("/notifikasi-global/notifikasi-pengajuan-barang", { params: query });

    return result.data;
  }
}
