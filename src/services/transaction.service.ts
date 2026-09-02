import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreateTransactionForRequestType,
  ResponseForReturBarang,
  ResponsePilihPelangganType,
  ResponseProdukDetailType,
  ResponseRiwayatTransactionType,
  ResponseRiwayatTransaksiPelangganType,
  ResponseStatistikBookingType,
  ResponseStatistikKebutuhanBarang,
  ResponseTransactionType,
  ResponseTransaksiBookingByPelangganType,
  ResponseTransaksiBookingWithPelangganWithMetaType,
  ResponseTransaksiDraftType,
  TambahProdukDetailForReqeustType,
  UpdateProdukDetail,
} from "../models/transaction.model";
import type { PaymentMethodType } from "../types/constant.type";
import type { ResponseStructure } from "../types/response.type";

export class TransactionServices {
  // create
  static async create(
    req: CreateTransactionForRequestType,
  ): Promise<ResponseStructure<ResponseTransactionType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTransactionType | null>
    >("/transaction", req);

    return result.data;
  }

  // find by id
  static async findById(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTransactionType | null>
    >(`/transaction/${params.id}`);

    return result.data;
  }

  static async findRiwayatTransaksi(
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
      metodePembayaran?: string;
    },
  ): Promise<ResponseStructure<ResponseRiwayatTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatTransactionType | null>
    >("/transaction", { params: query });

    return result.data;
  }

  // find riwayat transaksi by pelanggan
  static async findRiwayatTransaksiCompletedNotTempoByPelanggan(params: {
    id: number;
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
      metodePembayaran?: string;
    };
  }): Promise<ResponseStructure<ResponseRiwayatTransaksiPelangganType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatTransaksiPelangganType | null>
    >(`/transaction/completed/pelanggan/${params.id}`, {
      params: params.query,
    });

    return result.data;
  }

  // find  transaksi booking
  static async findTransaksiBookingWithPelanggan(params: {
    query: PaginationType;
  }): Promise<
    ResponseStructure<ResponseTransaksiBookingWithPelangganWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTransaksiBookingWithPelangganWithMetaType | null>
    >(`/transaction/booking`, { params: params.query });

    return result.data;
  }

  // kebutuhan barang booking
  static async kebutuhanBarang(params: {
    transactionId?: number;
  }): Promise<ResponseStructure<ResponseStatistikKebutuhanBarang[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikKebutuhanBarang[] | null>
    >(`/transaction/booking/kebutuhan-barang`, {
      params,
    });

    return result.data;
  }

  // find riwayat transaksi booking by pelanggan
  static async findTransaksiBookingByPelanggan(params: {
    pelangganId: number;
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
      statusTempo?: string;
      metodePembayaran?: string;
    };
  }): Promise<
    ResponseStructure<ResponseTransaksiBookingByPelangganType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseTransaksiBookingByPelangganType | null>
    >(`/transaction/booking/pelanggan/${params.pelangganId}`, {
      params: params.query,
    });

    return result.data;
  }

  // statistik
  static async statistikBooking(): Promise<
    ResponseStructure<ResponseStatistikBookingType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikBookingType | null>
    >(`/transaction/booking/statistik`);

    return result.data;
  }

  // statistik by pelanggan
  static async statistikBookingByPelanggan(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseStatistikBookingType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikBookingType | null>
    >(`/transaction/booking/statistik/pelanggan/${params.id}`);

    return result.data;
  }

  // find transaksi by for retur barang
  static async findTransaksiForReturBarang(params: {
    id: number;
  }): Promise<ResponseStructure<ResponseForReturBarang | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseForReturBarang | null>
    >(`/transaction/${params.id}/for-retur-barang`);

    return result.data;
  }

  // find transaksi draft
  static async findTransaksiDraft(): Promise<
    ResponseStructure<ResponseTransaksiDraftType | null>
  > {
    // call api
    const result =
      await instanceAxios.get<
        ResponseStructure<ResponseTransaksiDraftType | null>
      >(`/transaction/draft`);

    return result.data;
  }

  // pilih pelanggan
  static async pilihPelanggan(data: {
    pelangganId: number;
  }): Promise<ResponseStructure<ResponsePilihPelangganType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePilihPelangganType | null>
    >(`/transaction/pilih-pelanggan`, data);

    return result.data;
  }

  // create fast pelanggan
  static async fastCreateCustomer(data: {
    pelangganId?: number;
    transactionId: number;
    nama: string;
  }): Promise<ResponseStructure<ResponsePilihPelangganType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponsePilihPelangganType | null>
    >(`/transaction/fast-create-customer`, data);

    return result.data;
  }

  // tambah produk
  static async tambahProduk(
    data: TambahProdukDetailForReqeustType,
  ): Promise<ResponseStructure<ResponseTransaksiDraftType | null>> {
    // call api
    const result = await instanceAxios.post<
      ResponseStructure<ResponseTransaksiDraftType | null>
    >(`/transaction/tambah-produk`, data);

    return result.data;
  }

  // update produk
  static async updateProduk(params: {
    detailId: number;
    data: UpdateProdukDetail;
  }): Promise<ResponseStructure<ResponseTransaksiDraftType | null>> {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<ResponseTransaksiDraftType | null>
    >(`/transaction/detail/${params.detailId}`, params.data);

    return result.data;
  }

  // update metode pembayaran
  static async updateMetodePembayaran(params: {
    transactionId: number;
    data: { metodePembayaran: PaymentMethodType };
  }): Promise<
    ResponseStructure<{
      transactionId: number;
      metodePembayaran: PaymentMethodType;
    } | null>
  > {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<{
        transactionId: number;
        metodePembayaran: PaymentMethodType;
      } | null>
    >(`/transaction/${params.transactionId}/metode-pembayaran`, params.data);

    return result.data;
  }

  // update ongkir
  static async updateOngkir(params: {
    transactionId: number;
    data: { ongkir: number };
  }): Promise<
    ResponseStructure<{
      transactionId: number;
      ongkir: number;
    } | null>
  > {
    // call api
    const result = await instanceAxios.patch<
      ResponseStructure<{
        transactionId: number;
        ongkir: number;
      } | null>
    >(`/transaction/${params.transactionId}/ongkir`, params.data);

    return result.data;
  }

  // remove produk details
  static async removeProdukDetails(params: {
    detailId: number;
  }): Promise<ResponseStructure<ResponseProdukDetailType | null>> {
    // call api
    const result = await instanceAxios.delete<
      ResponseStructure<ResponseProdukDetailType | null>
    >(`/transaction/detail/${params.detailId}`);

    return result.data;
  }

  // remove all
  static async removeAllProdukDetails(params: {
    transactionId: number;
  }): Promise<ResponseStructure<null>> {
    // call api
    const result = await instanceAxios.delete<ResponseStructure<null>>(
      `/transaction/${params.transactionId}/all-detail`,
    );

    return result.data;
  }
}
