import { useEffect, useState } from "react";
import { useFilter } from "../../../hooks/useFilter";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import useInfinityGetProduk from "../../../hooks/useInfinityGetProduk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ResponseTransactionDetailType,
  UpdateHargaAndDiskonAndQuantityForRequestType,
} from "../../../models/transactionDetail.model";
import { TransactionDetailServices } from "../../../services/transactionDetail.service";
import { TransactionServices } from "../../../services/transaction.service";
import type { ResponseStructure } from "../../../types/response.type";
import type { ResponseTransaksiDraftType } from "../../../models/transaction.model";

type MutationResponse =
  | ResponseStructure<ResponseTransaksiDraftType | null>
  | ResponseStructure<ResponseTransactionDetailType | null>;

const useModalPilihanProduk = (params: {
  enabled?: boolean;
  pelangganId?: number;
  handleCloseModal: () => void;
  existProduks?: { produkId: number }[];
  transactionId?: number;
  detailId?: number;
  transactionIdForAddProdukForUpdateTransaksi?: number;
}) => {
  const {
    enabled,
    pelangganId,
    existProduks,
    handleCloseModal,
    transactionId,
    detailId,
    transactionIdForAddProdukForUpdateTransaksi,
  } = params;

  const queryClient = useQueryClient();

  const [existingProdukIds, setExistingProdukIds] = useState<number[]>(
    () => existProduks?.map((item) => item.produkId) ?? [],
  );

  useEffect(() => {
    setExistingProdukIds(existProduks?.map((item) => item.produkId) ?? []);
  }, [existProduks]);

  //   state booking
  const [bookingProduk, setBookingProduk] =
    useState<UpdateHargaAndDiskonAndQuantityForRequestType | null>(null);

  // search filter
  const { search, setSearch } = useFilterSearch("search", "page");

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
    isNumber: true,
    resetPage: true,
  });

  // QUERY PRODUK
  const {
    dataProduk,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingProduk,
  } = useInfinityGetProduk({
    pelangganId,
    disabled: !enabled,
    kategori,
    search,
  });

  const { containerRef: produkContainerRef, loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    rootMargin: "200px",
  });

  const isExistDataProduk = dataProduk.length > 0;

  const {
    mutateAsync: mutateUpdateBooking,
    isPending: isPendingUpdateBooking,
  } = useMutation<
    MutationResponse,
    Error,
    {
      detailId?: number;
      req?: UpdateHargaAndDiskonAndQuantityForRequestType;
      reqForAdd?: Required<UpdateHargaAndDiskonAndQuantityForRequestType>;
    }
  >({
    mutationFn: (params) => {
      // TAMBAH PRODUK KE TRANSAKSI
      if (
        transactionIdForAddProdukForUpdateTransaksi &&
        params.reqForAdd &&
        !params.req
      ) {
        return TransactionServices.tambahProdukByTransactionId({
          transactionId: transactionIdForAddProdukForUpdateTransaksi,
          data: {
            detail: {
              diskon: 0,
              hargaJual: params.reqForAdd.hargaJual,
              produkId: params.reqForAdd.produkId,
              quantity: params.reqForAdd.quantity,
            },
            fromUpdateBooking: true,
          },
        });
      }

      // UPDATE DETAIL TRANSAKSI
      if (params.req && params.detailId) {
        return TransactionDetailServices.updateTransaksiDetail({
          transactionDetailId: params.detailId,
          req: params.req,
        });
      }

      throw new Error("Data produk untuk diproses tidak tersedia");
    },

    onSuccess: () => {
      if (transactionIdForAddProdukForUpdateTransaksi) {
        queryClient.invalidateQueries({
          queryKey: [
            "kebutuhan-barang",
            transactionIdForAddProdukForUpdateTransaksi,
          ],
        });
      }
      queryClient.invalidateQueries({
        queryKey: [
          "transaction",
          transactionId ?? transactionIdForAddProdukForUpdateTransaksi,
        ],
      });

      handleCloseModal();
    },

    onError: (err) => {
      console.log(err);
    },
  });

  //   handle update booking
  const handleUpdateBooking = async () => {
    try {
      if (bookingProduk) {
        if (detailId) {
          await mutateUpdateBooking({
            detailId,
            req: {
              produkId: bookingProduk.produkId,
              hargaJual: bookingProduk.hargaJual,
              quantity: bookingProduk.quantity,
              diskon: 0,
            },
          });
        } else if (transactionIdForAddProdukForUpdateTransaksi) {
          await mutateUpdateBooking({
            reqForAdd: {
              produkId: bookingProduk.produkId ?? 0,
              hargaJual: bookingProduk.hargaJual ?? 0,
              quantity: bookingProduk.quantity ?? 0,
              diskon: 0,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetProdukBooking = (
    params: UpdateHargaAndDiskonAndQuantityForRequestType,
  ) => {
    setBookingProduk(params);
  };

  // handle close dan reset existing ke produk id dari parent
  const handleCloseModalAndResetExisting = () => {
    setExistingProdukIds(existProduks?.map((item) => item.produkId) ?? []);
    setBookingProduk({});
    handleCloseModal();
  };

  return {
    dataProduk,
    produkContainerRef,
    loadMoreRef,
    setSearch,
    kategori,
    handleKategori,
    isLoadingProduk,
    isExistDataProduk,
    handleUpdateBooking,
    isPendingUpdateBooking,
    handleSetProdukBooking,
    existingProdukIds,
    bookingProduk,
    isFetchingNextPage,
    handleCloseModalAndResetExisting,
  };
};

export default useModalPilihanProduk;
