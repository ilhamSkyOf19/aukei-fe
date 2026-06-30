import { useQuery } from "@tanstack/react-query";
import { useFilterSearch } from "../../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../../hooks/useFilter";
import { ProdukServices } from "../../../../../services/produk.service";
import { useSearchParams } from "react-router-dom";
import type {
  DetailsForCreate,
  DetailsLocalStorageType,
} from "../../../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../../../models/produk.model";
import { useEffect } from "react";

const useShowProduk = (params: {
  pelangganId?: number;
  step: number;
  handleAppend: (
    produk: Pick<DetailsForCreate, "hargaJual" | "produkId" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id"> & { diskon?: number },
  ) => void;
}) => {
  const { pelangganId, step, handleAppend } = params;

  //   get current page form search params
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get("page") ?? "";

  // search filter
  const { search, setSearch } = useFilterSearch("search", "page");

  // page filter
  const { filter: page, setFilter } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  //   handle page
  const handlePage = (val: "prev" | "next") => {
    if (val === "next") {
      if (Number(currentPage) > 1) {
        setFilter((Number(currentPage) + 1).toString());
      } else {
        return;
      }
    } else if (val === "prev") {
      if (Number(currentPage) <= 1) {
        return;
      }
      setFilter((Number(currentPage) - 1).toString());
    }
  };

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

  // check local storage
  useEffect(() => {
    if (!dataProduk?.data?.data) return;

    const details = localStorage.getItem("details");
    const diBayar = localStorage.getItem("diBayar");

    if (!details) {
      if (diBayar) localStorage.removeItem("diBayar");
      return;
    }

    const detailsParse: DetailsLocalStorageType[] = JSON.parse(details);

    detailsParse.forEach((item) => {
      const produk = dataProduk?.data?.data.find((p) => p.id === item.produkId);

      handleAppend({
        produkId: item.produkId,
        hargaJual: item.hargaJual,
        img: item.img,
        kode: item.kode,
        nama: item.nama,
        quantity: item.quantity,
        diskon: item.diskon,
        stok: produk?.stok ?? 0,
        hargaJualTerakhirTransaksi: produk?.hargaJualTerakhirTransaksi ?? 0,
      });
    });
  }, [dataProduk]);

  return {
    dataProduk,
    isLoadingProduk,
    setSearch,
    handlePage,
    handleKategori,
    isExistDataProduk,
  };
};

export default useShowProduk;
