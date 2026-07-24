import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  CreateTransactionForRequestType,
  ResponseRiwayatTransactionType,
  ResponseRiwayatTransaksiPelangganType,
  ResponseStatistikBookingType,
  ResponseStatistikKebutuhanBarang,
  ResponseTransactionType,
  ResponseTransaksiBookingByPelangganType,
  ResponseTransaksiBookingWithPelangganWithMetaType,
} from "../models/transaction.model";
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
      statusTempo?: string;
    },
  ): Promise<ResponseStructure<ResponseRiwayatTransactionType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatTransactionType | null>
    >("/transaction", { params: query });

    return result.data;
  }

  // find riwayat transaksi by pelanggan
  static async findRiwayatTransaksiByPelanggan(params: {
    id: number;
    query: PaginationType & {
      startDate?: string;
      endDate?: string;
      metodePembayaran?: string;
      status?: string;
      statusTempo?: string;
    };
  }): Promise<ResponseStructure<ResponseRiwayatTransaksiPelangganType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRiwayatTransaksiPelangganType | null>
    >(`/transaction/pelanggan/${params.id}`, { params: params.query });

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
}
