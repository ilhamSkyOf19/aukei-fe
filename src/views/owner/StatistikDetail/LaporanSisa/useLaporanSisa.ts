import { useQueries } from "@tanstack/react-query";
import { StatistikServices } from "../../../../services/statistik.service";
import { useKategoriChooseStore } from "../../../../stores/kategoriChooseStore";
import { useMemo } from "react";

const useLaporanSisa = () => {
  // kategori store
  const { kategori, resetKategori, setKategori } = useKategoriChooseStore(
    (state) => state,
  );

  const data = useQueries({
    queries: [
      {
        queryKey: ["laporan-sisa"],
        queryFn: async () => StatistikServices.laporanSisa(),
        retry: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["daftar-produk-laporan-sisa", kategori.id],
        queryFn: async () =>
          StatistikServices.daftarSisaStokModalByProduk({
            kategoriId: kategori.id,
          }),
        enabled: kategori.id !== null,
        retry: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    {
      data: dataLaporanSisa,
      isLoading: isLoadingLaporanSisa,
      isRefetching: isRefetchingLaporanSisa,
      refetch: refetchLaporanSisa,
    },
    {
      data: dataSisaModalByProduk,
      isLoading: isLoadingSisaModalByProduk,
      isRefetching: isRefetchingSisaModalByProduk,
      refetch: refetchLaporanSisaModalByProduk,
    },
  ] = data;

  // statistik
  const statistik: {
    totalStok: number;
    totalModal: number;
    totalEstimasiOmzet: number;
  } = useMemo(() => {
    if (dataSisaModalByProduk) {
      return {
        totalStok: dataSisaModalByProduk.data?.totalStok ?? 0,
        totalModal: dataSisaModalByProduk.data?.totalModal ?? 0,
        totalEstimasiOmzet: dataSisaModalByProduk.data?.totalEstimasiOmzet ?? 0,
      };
    }
    if (dataLaporanSisa) {
      return {
        totalStok: dataLaporanSisa.data?.totalStok ?? 0,
        totalModal: dataLaporanSisa.data?.totalModal ?? 0,
        totalEstimasiOmzet: dataLaporanSisa.data?.totalEstimasiOmzet ?? 0,
      };
    }
    return {
      totalStok: 0,
      totalModal: 0,
      totalEstimasiOmzet: 0,
    };
  }, [dataLaporanSisa, dataSisaModalByProduk]);

  const handleRefresh = async () => {
    if (kategori.id !== 0) {
      await refetchLaporanSisaModalByProduk({
        throwOnError: true,
      });
    } else {
      await refetchLaporanSisa({
        throwOnError: true,
      });
    }
    // await grafikLineRef.current?.refetchActive();
  };

  return {
    dataLaporanSisa,
    isLoadingLaporanSisa,
    isRefetchingLaporanSisa,
    handleRefresh,

    statistik,

    dataSisaModalByProduk,
    isLoadingSisaModalByProduk,
    isRefetchingSisaModalByProduk,
    refetchLaporanSisaModalByProduk,

    kategori,

    setKategori,

    resetKategori,
  };
};

export default useLaporanSisa;
