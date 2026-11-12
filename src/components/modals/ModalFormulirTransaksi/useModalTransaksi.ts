import { useController, useForm, useWatch } from "react-hook-form";
import type {
  DetailsForCreate,
  TambahProdukDetailForReqeustType,
} from "../../../models/transaction.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionValidation } from "../../../validations/transaction.validation";
import type { ResponseProdukForKasirType } from "../../../models/produk.model";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import { TransactionDetailServices } from "../../../services/transactionDetail.service";
import type { UpdateHargaAndDiskonAndQuantityForRequestType } from "../../../models/transactionDetail.model";
import useInfinityGetProduk from "../../../hooks/useInfinityGetProduk";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";

type DiskonType = "PERCENT" | "RP";

type ModalProdukData = Pick<
  DetailsForCreate,
  "produkId" | "hargaJual" | "quantity"
> &
  Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
    diskon?: number;
    detailId?: number;
    hargaModalRataRata: number;
    hargaJualOld?: number;
    transactionId?: number;
  };

type UpdateBookingRequest = UpdateHargaAndDiskonAndQuantityForRequestType & {
  produkId: number;
};

const useModalTransaksi = (params: {
  handleCloseModal: () => void;
  data?: ModalProdukData;
  handleSetAlert?: (data: string) => void;
  isBooking?: boolean;
  pelangganId?: number;
  existProduks?: { produkId: number }[];
}) => {
  const {
    handleCloseModal,
    data,
    handleSetAlert,
    isBooking,
    pelangganId,
    existProduks,
  } = params;

  const [isShowChooseProduk, setIsShowChooseProduk] = useState<boolean>(false);

  // STATE SUB TOTAL
  const [subTotal, setSubTotal] = useState<number>(0);

  // STATE TOTAL DISKON
  const [totalDiskon, setTotalDiskon] = useState<number>(0);

  // STATE TOTAL DISKON PERSEN
  const [totalDiskonPersen, setTotalDiskonPersen] = useState<number>(0);

  // search filter
  const { search, setSearch } = useFilterSearch("search", "page");

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
    isNumber: true,
    resetPage: true,
  });

  const [existingProdukIds, setExistingProdukIds] = useState<number[]>(
    () => existProduks?.map((item) => item.produkId) ?? [],
  );

  useEffect(() => {
    setExistingProdukIds(existProduks?.map((item) => item.produkId) ?? []);
  }, [existProduks]);

  // STATE DATA PRODUK BOOKING
  const [bookingProduk, setBookingProduk] = useState<
    ModalProdukData | undefined
  >(data);

  // QUERY PRODUK
  const {
    dataProduk,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingProduk,
  } = useInfinityGetProduk({
    pelangganId,
    disabled: !isBooking || !isShowChooseProduk,
    kategori,
    search,
  });

  const { containerRef: produkContainerRef, loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    rootMargin: "200px",
  });

  // USE FORM
  const { control, handleSubmit, reset, setValue } = useForm<DetailsForCreate>({
    resolver: zodResolver(TransactionValidation.DETAILS),
  });

  const [diskonType, setDiskonType] = useState<DiskonType>(() => {
    const value = localStorage.getItem("diskon-type");

    return value === "PERCENT" || value === "RP" ? value : "RP";
  });

  // SET DEFAULT VALUE
  useEffect(() => {
    if (!data) return;

    // Sinkronisasi data parameter ke state booking
    setBookingProduk(data);

    const harga = Number(data.hargaJual ?? 0);
    const qty = Number(data.quantity ?? 0);
    const totalDiskonData = Number(data.diskon ?? 0);

    const diskonPerUnit = qty > 0 ? totalDiskonData / qty : 0;

    const diskonPersen = harga > 0 ? (diskonPerUnit / harga) * 100 : 0;

    reset({
      produkId: data.produkId,
      hargaJual: harga,
      quantity: qty,
      diskon: diskonPerUnit,
      diskonPersen,
    });

    const totalHarga = harga * qty;
    const subtotal = totalHarga - totalDiskonData;

    const totalDiskonPersen =
      totalHarga > 0
        ? Number(((totalDiskonData / totalHarga) * 100).toFixed(2))
        : 0;

    setSubTotal(subtotal);
    setTotalDiskon(totalDiskonData);
    setTotalDiskonPersen(totalDiskonPersen);
  }, [data, reset]);

  const hargaJual = useWatch({
    control,
    name: "hargaJual",
  });

  const quantity = useWatch({
    control,
    name: "quantity",
  });

  const diskon = useWatch({
    control,
    name: "diskon",
  });

  const diskonPersen = useWatch({
    control,
    name: "diskonPersen",
  });

  // HITUNG TOTAL TRANSAKSI
  useEffect(() => {
    const timeout = setTimeout(() => {
      const harga = Number(hargaJual ?? 0);
      const qty = Number(quantity ?? 0);
      const nominalDiskon = Number(diskon ?? 0);

      const totalDiskonBaru = nominalDiskon * qty;
      const totalHarga = harga * qty;
      const subtotal = totalHarga - totalDiskonBaru;

      const totalDiskonPersenBaru =
        totalHarga > 0
          ? Number(((totalDiskonBaru / totalHarga) * 100).toFixed(2))
          : 0;

      setTotalDiskon(totalDiskonBaru);
      setSubTotal(subtotal);
      setTotalDiskonPersen(totalDiskonPersenBaru);
    }, 100);

    return () => clearTimeout(timeout);
  }, [hargaJual, quantity, diskon]);

  // CONTROLLER HARGA
  const hargaJualController = useController({
    control,
    name: "hargaJual",
  });

  // CONTROLLER DISKON
  const diskonController = useController({
    control,
    name: "diskon",
  });

  // CONTROLLER QUANTITY
  const quantityController = useController({
    control,
    name: "quantity",
  });

  // CONTROLLER DISKON PERSEN
  const diskonPersenController = useController({
    control,
    name: "diskonPersen",
  });

  // SINKRONISASI DISKON
  useEffect(() => {
    const harga = Number(hargaJual ?? 0);

    if (diskonType === "PERCENT") {
      const persen = Number(diskonPersen ?? 0);
      const nominal = harga > 0 ? (persen / 100) * harga : 0;

      if (Number(diskon ?? 0) !== nominal) {
        setValue("diskon", nominal);
      }
    } else {
      const nominal = Number(diskon ?? 0);
      const persen = harga > 0 ? Math.trunc((nominal / harga) * 100) : 0;

      if (Number(diskonPersen ?? 0) !== persen) {
        setValue("diskonPersen", persen);
      }
    }
  }, [diskonType, diskon, diskonPersen, hargaJual, setValue]);

  // HANDLE GANTI PRODUK BOOKING
  const handleGantiProduk = (produk: ResponseProdukForKasirType) => {
    setBookingProduk((prev) => {
      if (!prev) return prev;

      setExistingProdukIds((current) => [
        ...current.filter((id) => id !== prev.produkId),
        produk.id,
      ]);

      return {
        ...prev,
        ...produk,

        produkId: produk.id,

        // Harga master produk baru
        hargaJualOld: Number(produk.hargaJual),

        // Harga transaksi di-reset ke harga master
        hargaJual: Number(produk.hargaJual),
      };
    });

    const hargaBaru = Number(produk.hargaJual);
    const qty = Number(quantity ?? bookingProduk?.quantity ?? 1);

    reset({
      produkId: produk.id,
      hargaJual: hargaBaru,
      quantity: qty,
      diskon: 0,
      diskonPersen: 0,
    });

    setTotalDiskon(0);
    setTotalDiskonPersen(0);
    setSubTotal(hargaBaru * qty);
  };

  // QUERY CLIENT
  const queryClient = useQueryClient();

  // MUTATION PILIH PRODUK BIASA
  const { mutateAsync: handleTambahProduk, isPending: isPendingTambahProduk } =
    useMutation({
      mutationFn: (req: TambahProdukDetailForReqeustType) => {
        if (data?.detailId) {
          return TransactionServices.updateProduk({
            detailId: data.detailId,
            data: {
              diskon: req.detail.diskon,
              hargaJual: req.detail.hargaJual,
              qty: req.detail.quantity,
              produkId: req.detail.produkId,
            },
          });
        } else if (data?.transactionId) {
          return TransactionServices.tambahProdukByTransactionId({
            transactionId: data.transactionId,
            data: req,
          });
        } else {
          return TransactionServices.tambahProduk(req);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["transaksi-draft"],
        });
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err.response?.data.meta.message.includes("stok tidak mencukupi")
          ) {
            handleSetAlert?.("stock_not_enough");
          }
        }
      },
    });

  // MUTATION UPDATE BOOKING
  const {
    mutateAsync: mutateUpdateBooking,
    isPending: isPendingUpdateBooking,
  } = useMutation({
    mutationFn: (params: { detailId: number; req: UpdateBookingRequest }) => {
      return TransactionDetailServices.updateTransaksiDetail({
        transactionDetailId: params.detailId,
        req: params.req,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction", data?.transactionId],
      });

      handleCloseModal();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // ON SUBMIT
  const onSubmit = async (req: DetailsForCreate) => {
    if (!req) return;

    if (isBooking && bookingProduk?.detailId) {
      return await mutateUpdateBooking({
        detailId: bookingProduk.detailId,
        req: {
          produkId: bookingProduk.produkId,
          diskon: (req.diskon ?? 0) * req.quantity,
          hargaJual: req.hargaJual,
          quantity: req.quantity,
        },
      });
    }

    await handleTambahProduk({
      detail: {
        produkId: req.produkId,
        diskon: (req.diskon ?? 0) * req.quantity,
        hargaJual: req.hargaJual,
        quantity: req.quantity,
      },
    });

    handleCloseModal();
  };

  // HANDLE GANTI TIPE DISKON
  const handleDiskonType = (value: DiskonType) => {
    const harga = Number(hargaJual ?? 0);

    if (value === diskonType) return;

    if (value === "PERCENT") {
      const nominal = Number(diskon ?? 0);
      const persen = harga > 0 ? (nominal / harga) * 100 : 0;

      setValue("diskonPersen", persen);
    } else {
      const persen = Number(diskonPersen ?? 0);
      const nominal = (persen / 100) * harga;

      setValue("diskon", nominal);
    }

    localStorage.setItem("diskon-type", value);
    setDiskonType(value);
  };

  const isExistDataProduk = dataProduk.length > 0;

  return {
    hargaJualController,
    diskonController,
    quantityController,
    handleSubmit,
    onSubmit,
    subTotal,
    totalDiskon,
    isPendingTambahProduk,
    hargaJual,
    handleDiskonType,
    diskonPersenController,
    diskonType,
    totalDiskonPersen,
    isPendingUpdateBooking,

    // DATA PRODUK BOOKING
    bookingProduk,
    handleGantiProduk,

    // DATA INFINITE PRODUK
    dataProduk,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingProduk,
    produkContainerRef,
    loadMoreRef,
    isExistDataProduk,
    existingProdukIds,
    setSearch,
    handleKategori,
    kategori,
    setIsShowChooseProduk,
    isShowChooseProduk,
  };
};

export default useModalTransaksi;
