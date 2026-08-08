import { useQueries } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { NotifikasiGlobalServices } from "../../../../services/notifikasiGlobal.service";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "../../../../hooks/useRefresh";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import { ROLE_INTERNAL_TYPE } from "../../../../types/constant.type";
import { useNotifikasiStore } from "../../../../stores/notifikasiStore";
import { RiwayatPengajuanReturBarangService } from "../../../../services/riwayatPengajuanReturBarang.service";

const useNotifikasi = (params: {
  pengguna?: PayloadPenggunaInternalType | null;
}) => {
  const { pengguna } = params;

  const [isChoose, setIsChoose] = useState<string>("semua");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ulRef = useRef<HTMLUListElement>(null);
  const buttonDropdownRef = useRef<HTMLButtonElement>(null);

  // get pengguna

  // use click outside
  useClickOutside({
    refs: [ulRef, buttonDropdownRef],
    callback: () => setIsOpen(false),
  });

  // navigate
  const navigate = useNavigate();

  // get store notifikasi
  const setSelectedNotifikasi = useNotifikasiStore(
    (state) => state.setSelectedNotifikasi,
  );

  // query notifikasi global
  const data = useQueries({
    queries: [
      {
        queryKey: ["notifikasi-global"],
        queryFn: () => NotifikasiGlobalServices.findAll(),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "semua",
      },

      {
        queryKey: ["notifikasi-produk"],
        queryFn: () =>
          NotifikasiGlobalServices.findNotifikasiProduk({ limit: "8" }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "produk",
      },
      {
        queryKey: ["notifikasi-tempo"],
        queryFn: () =>
          NotifikasiGlobalServices.findNotifikasiTempo({ limit: "8" }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "tempo",
      },
      {
        queryKey: ["notifikasi-pengajuan-barang"],
        queryFn: () =>
          NotifikasiGlobalServices.findNotifikasiPengajuanBarang({
            limit: "8",
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "pengajuan",
      },
      {
        queryKey: ["notifikasi-pengajuan-retur-barang"],
        queryFn: () =>
          RiwayatPengajuanReturBarangService.findAllByReturBarangForHighlight(),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "pengajuanReturBarang",
      },
    ],
  });

  const [
    {
      data: notifikasiGlobal,
      isLoading: isLoadingNotifikasiGlobal,
      refetch: refetchNotifikasi,
    },

    {
      data: dataNotifikasiProduk,
      isLoading: isLoadingDataNotifikasiProduk,
      refetch: refetchDataNotifikasiProduk,
    },

    {
      data: dataNotifikasiTempo,
      isLoading: isLoadingDataNotifikasiTempo,
      refetch: refetchDataNotifikasiTempo,
    },
    {
      data: dataNotifikasiPengajuanBarang,
      isLoading: isLoadingDataNotifikasiPengajuanBarang,
      refetch: refetchDataNotifikasiPengajuanBarang,
    },
    {
      data: dataNotifikasiPengajuanReturBarang,
      isLoading: isLoadingDataNotifikasiPengajuanReturBarang,
      refetch: refetchDataNotifikasiPengajuanReturBarang,
    },
  ] = data;

  // data notifikasi global produk
  const dataNotifikasiGlobalProduk = notifikasiGlobal?.data?.notifikasiProduk;

  // data notifikasi global tempo
  const dataNotifikasiGlobalTempoOverdue =
    notifikasiGlobal?.data?.notifikasiTempoOverdue;

  // data notifikasi pengajuan barang
  const dataNotifikasiGlobalPengajuanBarang =
    notifikasiGlobal?.data?.notifikasiPengajuanBarang;

  // data notifikasi pengajuan retur barang
  const dataNotifikasiGlobalPengajuanReturBarang =
    notifikasiGlobal?.data?.notifikasiPengajuanReturBarang;

  // is existing data notifikasi global produk
  const isExistingNotifikasiGlobal =
    (dataNotifikasiGlobalProduk && dataNotifikasiGlobalProduk.length > 0) ||
    (dataNotifikasiGlobalTempoOverdue &&
      dataNotifikasiGlobalTempoOverdue.length > 0) ||
    (dataNotifikasiGlobalPengajuanBarang &&
      dataNotifikasiGlobalPengajuanBarang.length > 0) ||
    (dataNotifikasiGlobalPengajuanReturBarang &&
      dataNotifikasiGlobalPengajuanReturBarang.length > 0);

  //   handle redirect produk detail
  const handleRedirectProdukDetail = (id: number) => {
    setIsOpen(false);
    return navigate(`/dashboard/produk/${id}`);
  };

  //   handle redirect tempo detail
  const handleRedirectTempoDetail = (params: {
    tempoId: number;
    pelangganId: number;
  }) => {
    setIsOpen(false);
    return navigate(
      `/dashboard/kredit/pelanggan/${params.pelangganId}/tempo/${params.tempoId}`,
    );
  };

  // handle redirect tempo detail
  const handleRedirectPengajuanReturBarangDetail = (params: {
    pelangganId?: number;
    transactionId?: number;
    returBarangId?: number;
  }) => {
    setIsOpen(false);
    return navigate(
      `/dashboard/riwayat-transaksi/pelanggan/${params.pelangganId}/transaksi/${params.transactionId}/daftar-retur-barang/detail/${params.returBarangId}`,
    );
  };

  // handle redirect pengajuan barang detail
  const handleRedirectPengajuanBarangDetail = (params: {
    barangMasukId?: number;
    barangKeluarId?: number;
  }) => {
    // close
    setIsOpen(false);

    if (pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) {
      if (params.barangMasukId) {
        navigate(
          `/dashboard/inventori/pengajuan-barang-masuk/${params.barangMasukId}`,
        );
      } else {
        navigate(
          `/dashboard/inventori/pengajuan-barang-keluar/${params.barangKeluarId}`,
        );
      }
    } else {
      if (params.barangMasukId) {
        navigate(`/dashboard/pengajuan-barang-masuk/${params.barangMasukId}`);
      } else {
        navigate(`/dashboard/pengajuan-barang-keluar/${params.barangKeluarId}`);
      }
    }
  };

  //   handle referesh
  const onRefresh = async () => {
    if (isChoose === "semua") {
      await refetchNotifikasi({
        throwOnError: true,
      });
    } else if (isChoose === "produk") {
      await refetchDataNotifikasiProduk({
        throwOnError: true,
      });
    } else if (isChoose === "tempo")
      await refetchDataNotifikasiTempo({
        throwOnError: true,
      });
    else if (isChoose === "pengajuan")
      await refetchDataNotifikasiPengajuanBarang({
        throwOnError: true,
      });
    else if (isChoose === "pengajuanReturBarang")
      await refetchDataNotifikasiPengajuanReturBarang({
        throwOnError: true,
      });
  };

  //   is loading
  const {
    isLoading: isLoadingRefresh,
    refresh: handleRefresh,
    disabled: disabledRefresh,
  } = useRefresh({
    onRefresh,
  });

  // get count notifikasi global
  const countNotifikasiGlobal =
    dataNotifikasiGlobalProduk &&
    dataNotifikasiGlobalTempoOverdue &&
    dataNotifikasiGlobalPengajuanBarang &&
    dataNotifikasiGlobalPengajuanReturBarang
      ? dataNotifikasiGlobalProduk?.length +
        dataNotifikasiGlobalTempoOverdue?.length +
        dataNotifikasiGlobalPengajuanBarang?.length +
        dataNotifikasiGlobalPengajuanReturBarang?.length
      : undefined;

  // handle redirect detail
  const handleRedirectDetail = () => {
    if (isChoose === "produk") {
      setSelectedNotifikasi("produk");
    } else if (isChoose === "tempo") {
      setSelectedNotifikasi("tempo");
    } else if (isChoose === "pengajuan") {
      setSelectedNotifikasi("pengajuanBarang");
    } else {
      setSelectedNotifikasi("pengajuanReturBarang");
    }

    // close
    setIsOpen(false);

    navigate("/dashboard/notifikasi");
  };

  return {
    handleRedirectDetail,
    isChoose,
    handleSetIsChoose: setIsChoose,
    dataNotifikasiGlobalProduk,
    isLoadingNotifikasiGlobal,
    handleRedirectProdukDetail,
    dataNotifikasiProduk,
    dataNotifikasiTempo,
    isLoadingDataNotifikasiProduk,
    isLoadingDataNotifikasiTempo,
    handleRefresh,
    isLoadingRefresh,
    disabledRefresh,

    isExistingNotifikasiGlobal,
    dataNotifikasiGlobalTempoOverdue,

    handleIsOpen: setIsOpen,
    isOpen,
    ulRef,
    buttonDropdownRef,
    handleRedirectTempoDetail,

    countNotifikasiGlobal,

    dataNotifikasiPengajuanBarang,
    isLoadingDataNotifikasiPengajuanBarang,

    dataNotifikasiGlobalPengajuanBarang,
    handleRedirectPengajuanBarangDetail,

    dataNotifikasiGlobalPengajuanReturBarang,
    dataNotifikasiPengajuanReturBarang,
    isLoadingDataNotifikasiPengajuanReturBarang,

    handleRedirectPengajuanReturBarangDetail,
  };
};

export default useNotifikasi;
