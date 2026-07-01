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
  onAppendMany: (
    produkList: (Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id"> & {
        diskon?: number;
      })[],
  ) => void;
}) => {
  const { pelangganId, step, onAppendMany } = params;

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
        hargaJualTerakhirTransaksi: produk?.hargaJualTerakhirTransaksi ?? 0,
      };
    });

    onAppendMany(produkList); // sekali panggil, bawa semua data
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
