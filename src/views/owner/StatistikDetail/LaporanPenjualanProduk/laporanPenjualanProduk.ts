import { useQueries } from "@tanstack/react-query";
import { StatistikServices } from "../../../../services/statistik.service";
import { useKategoriChooseStore } from "../../../../stores/kategoriChooseStore";
import { useEffect, useMemo, useState } from "react";
import useFilterState from "../../../../services/useFilterState";
import { endOfDay, format, startOfDay } from "date-fns";
import type { ResponseDaftarLaporanProdukDetailByKategoriType } from "../../../../models/statistik.model";
import useModal from "../../../../hooks/useModal";

const useLaporanPenjualanProduk = () => {
  // kategori store
  const { kategori, resetKategori, setKategori } = useKategoriChooseStore(
    (state) => state,
  );

  //   sort omzet penjualan produk
  const [sortOmzet, setSortOmzet] = useState<string | undefined>(undefined);

  // sort laba
  const [sortLaba, setSortLaba] = useState<string | undefined>(undefined);

  // sort qty
  const [sortQty, setSortQty] = useState<string | undefined>(undefined);

  const { startDateEndDate, setStartDateEndDate } = useFilterState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const {
    modalRef: modalHitungPendapatanProdukRef,
    handleShowModal: handleShowModalHitungPendapatanProduk,
    handleCloseModal: handleCloseModalHitungPendapatanProduk,
  } = useModal();

  // handle sort omzet
  const handleSortOmzet = (value: string) => {
    setSortOmzet(value);
    setSortLaba(undefined);
    setSortQty(undefined);
  };

  // handle sort laba
  const handleSortLaba = (value: string) => {
    setSortLaba(value);
    setSortOmzet(undefined);
    setSortQty(undefined);
  };

  // handle sort qty
  const handleSortQty = (value: string) => {
    setSortQty(value);
    setSortOmzet(undefined);
    setSortLaba(undefined);
  };

  const data = useQueries({
    queries: [
      {
        queryKey: [
          "laporan-penjualan-produk",
          sortOmzet,
          sortLaba,
          sortQty,
          startDateEndDate?.startDate,
          startDateEndDate?.endDate,
        ],
        queryFn: async () =>
          StatistikServices.laporanPenjualanProduk({
            startDate:
              startDateEndDate?.startDate ??
              startOfDay(format(new Date(), "yyyy-MM-dd")).toString(),
            endDate:
              startDateEndDate?.endDate ??
              endOfDay(format(new Date(), "yyyy-MM-dd")).toString(),
            sortOmzet,
            sortLaba,
            sortQty,
          }),
        enabled: kategori.id === 0,
        retry: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: [
          "laporan-penjualan-produk-by-kategori",
          kategori.id,
          sortOmzet,
          sortLaba,
          sortQty,
          startDateEndDate?.startDate,
          startDateEndDate?.endDate,
        ],
        queryFn: async () =>
          StatistikServices.laporanPenjualanProdukByKategori({
            kategoriId: kategori.id,
            startDate:
              startDateEndDate?.startDate ??
              startOfDay(format(new Date(), "yyyy-MM-dd")).toString(),
            endDate:
              startDateEndDate?.endDate ??
              endOfDay(format(new Date(), "yyyy-MM-dd")).toString(),
            sortOmzet,
            sortLaba,
            sortQty,
          }),
        enabled: kategori.id !== 0,
        retry: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    {
      data: dataPenjualanProduk,
      isLoading: isLoadingLaporanProduk,
      isRefetching: isRefetchingLaporanPenjualanProduk,
      refetch: refetchLaporanPenjualanProduk,
    },
    {
      data: dataPenjualanProdukByKategori,
      isLoading: isLoadingPenjualanProdukByKategori,
      isRefetching: isRefetchingPenjualanProdukByKategori,
      refetch: refetchPenjualanProdukByKategori,
    },
  ] = data;

  // statistik
  const statistik: {
    totalProdukTerjual: number;
    totalQtyTerjual: number;
    totalLaba: number;
    totalOmzet: number;
  } = useMemo(() => {
    if (dataPenjualanProduk?.data) {
      return {
        totalProdukTerjual: dataPenjualanProduk.data?.totalProdukTerjual,
        totalQtyTerjual: dataPenjualanProduk.data?.totalQtyTerjual,
        totalLaba: dataPenjualanProduk.data?.totalLaba,
        totalOmzet: dataPenjualanProduk.data?.totalOmzet,
      };
    }
    return {
      totalProdukTerjual: 0,
      totalQtyTerjual: 0,
      totalLaba: 0,
      totalOmzet: 0,
    };
  }, [dataPenjualanProduk]);

  const handleRefresh = async () => {
    if (kategori.id !== 0)
      return await refetchPenjualanProdukByKategori({ throwOnError: true });

    await refetchLaporanPenjualanProduk({
      throwOnError: true,
    });
    // await grafikLineRef.current?.refetchActive();
  };

  // ==========================================
  // PILIHAN PRODUK
  // ==========================================

  const [selectedProducts, setSelectedProducts] = useState<
    ResponseDaftarLaporanProdukDetailByKategoriType[]
  >([]);

  // pilih / batal pilih satu produk
  const handlePilihProduk = (
    product: ResponseDaftarLaporanProdukDetailByKategoriType,
  ) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((item) => item.id === product.id);

      if (isSelected) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  };

  // pilih semua / batal pilih semua
  const handlePilihSemuaProduk = () => {
    const produk = dataPenjualanProdukByKategori?.data?.produk ?? [];

    setSelectedProducts((prev) => {
      const isAllSelected = produk.length > 0 && prev.length === produk.length;

      if (isAllSelected) {
        return [];
      }

      return produk;
    });
  };

  // handle back
  const handleBack = () => {
    resetKategori();
    setSelectedProducts([]);
  };

  // reset kategori
  useEffect(() => {
    // reset selected produk
    if (kategori.id !== 0 && selectedProducts.length > 0) {
      setSelectedProducts([]);
    }
  }, [dataPenjualanProdukByKategori]);

  return {
    dataPenjualanProduk,
    isLoadingLaporanProduk,
    isRefetchingLaporanPenjualanProduk,
    handleRefresh,

    statistik,

    kategori,

    setKategori,

    resetKategori,

    sortOmzet,

    sortLaba,

    sortQty,

    startDateEndDate: {
      startDate: startDateEndDate?.startDate,
      endDate: startDateEndDate?.endDate,
    },

    setStartDateEndDate,

    handleSortOmzet,

    handleSortLaba,

    handleSortQty,

    dataPenjualanProdukByKategori,
    isLoadingPenjualanProdukByKategori,
    isRefetchingPenjualanProdukByKategori,

    selectedProducts,
    handlePilihProduk,
    handlePilihSemuaProduk,

    modalHitungPendapatanProdukRef,
    handleCloseModalHitungPendapatanProduk,
    handleShowModalHitungPendapatanProduk,

    handleBack,
  };
};

export default useLaporanPenjualanProduk;
