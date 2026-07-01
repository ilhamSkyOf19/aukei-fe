import { useQuery } from "@tanstack/react-query";
import { useFilterSearch } from "../../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../../hooks/useFilter";
import { ProdukServices } from "../../../../../services/produk.service";
import { useSearchParams } from "react-router-dom";
import type { DetailsLocalStorageType } from "../../../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../../../models/produk.model";
import { useEffect } from "react";
import { handlePagination } from "../../../../../helpers/helpers";

const useShowProduk = (params: {
  pelangganId?: number;
  step: number;
  onAppendMany: (
    produkList: (Pick<
      ResponseProdukForKasirType,
      | "nama"
      | "img"
      | "hargaJual"
      | "kode"
      | "hargaJualTerakhirTransaksi"
      | "id"
      | "stok"
    > & { subTotal: number; diskon: number; quantity: number })[],
  ) => void;
}) => {
  const { pelangganId, step, onAppendMany } = params;

  //   get current page form search params
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get("page") ?? "";

  // search filter
  const { search, setSearch } = useFilterSearch("search", "page");

  // page filter
  const { filter: page, setFilter: setPage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
    isNumber: true,
  });

  // query
  const { data: dataProduk, isLoading: isLoadingProduk } = useQuery({
    queryKey: ["produk", search, page, kategori, step, pelangganId],
    queryFn: () =>
      ProdukServices.findAllForKasir({
        ...(search && { search }),
        ...(page && { page }),
        ...(kategori && { kategori }),
        ...(pelangganId && { pelangganId }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing produk
  const isExistDataProduk: boolean =
    !isLoadingProduk && dataProduk?.data
      ? dataProduk?.data?.data?.length > 0
        ? true
        : false
      : false;

  const details = localStorage.getItem("details");
  const diBayar = localStorage.getItem("diBayar");

  // check local storage

  useEffect(() => {
    if (!dataProduk?.data?.data) return;

    // hasRestore.current = true;

    if (!details) {
      if (diBayar) localStorage.removeItem("diBayar");
      return;
    }

    const detailsParse: DetailsLocalStorageType[] = JSON.parse(details);

    const produkList = detailsParse.map((item) => {
      const produk = dataProduk?.data?.data.find((p) => p.id === item.produkId);
      return {
        produkId: item.produkId,
        hargaJual: item.hargaJual,
        img: item.img,
        kode: item.kode,
        nama: item.nama,
        quantity: item.quantity,
        diskon: item.diskon,
        stok: produk?.stok ?? 0,
        subTotal: item.hargaJual * item.quantity,
        hargaJualTerakhirTransaksi: produk?.hargaJualTerakhirTransaksi ?? 0,
      };
    });

    onAppendMany(
      produkList.map((item) => ({
        ...item,
        id: item.produkId,
      })),
    );
  }, [dataProduk]);

  // pagination
  const { goTo, isNext, isPrev, pages } = handlePagination({
    setPage,
    currentPage: dataProduk?.data?.meta?.currentPage,
    totalPage: dataProduk?.data?.meta?.totalPage,
  });

  //   handle page
  const handlePage = (val: "prev" | "next") => {
    if (val === "next") {
      if (
        Number(currentPage) >= 1 &&
        Number(currentPage) < dataProduk?.data?.meta?.totalPage!
      ) {
        return setPage((Number(currentPage) + 1).toString());
      } else {
        return;
      }
    } else if (val === "prev") {
      if (Number(currentPage) <= 1) {
        return;
      }
      return setPage((Number(currentPage) - 1).toString());
    }
  };

  return {
    dataProduk,
    isLoadingProduk,
    setSearch,
    handlePage,
    handleKategori,
    isExistDataProduk,
    goTo,
    isNext,
    isPrev,
    pages,
  };
};

export default useShowProduk;
