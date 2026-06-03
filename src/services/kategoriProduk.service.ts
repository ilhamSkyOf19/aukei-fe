import instanceAxios from "../libs/axios";
import type {
  CreateKategoriProdukType,
  ResponseKategoriProdukChooseType,
  ResponseKategoriProdukType,
  ResponseKategoriProdukWithMetaType,
  UpdateKategoriProdukType,
} from "../models/kategoriProduk.model";
import type { PaginationType } from "../models/pagination.model";
import type { ResponseStructure } from "../types/response.type";

export class KategoriProdukServices {
  // find all
  static async findAll(
    query: PaginationType,
  ): Promise<ResponseStructure<ResponseKategoriProdukWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseKategoriProdukWithMetaType | null>
    >(`/kategori-produk`, {
      params: query,
    });

    return result.data;
  }

  // create
  static async create(
    req: CreateKategoriProdukType,
  ): Promise<ResponseStructure<ResponseKategoriProdukType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseKategoriProdukType | null>
    >("/kategori-produk", req);

    return result.data;
  }

  // update
  static async update(params: {
    id: number;
    req: UpdateKategoriProdukType;
  }): Promise<ResponseStructure<ResponseKategoriProdukType | null>> {
    const { id, req } = params;

    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseKategoriProdukType | null>
    >(`/kategori-produk/${id}`, req);

    return result.data;
  }

  // find all for choose
  static async findAllForChoose(): Promise<
    ResponseStructure<ResponseKategoriProdukChooseType[] | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseKategoriProdukChooseType[] | null>
    >(`/kategori-produk/for-choose`);

    return result.data;
  }

  // delete
  static async delete(id: number): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/kategori-produk/${id}`,
    );

    return result.data;
  }
}
