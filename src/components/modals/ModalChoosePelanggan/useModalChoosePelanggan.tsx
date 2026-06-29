import useDataPelanggan from "../../../hooks/useDataPelanggan";
import { generatePageNumbers } from "../../../helpers/helpers";
import { useState } from "react";

const useModalChoosePelanggan = () => {
  // filter search
  const [search, setSearch] = useState<string>("");

  // filter page
  const [page, setPage] = useState<string>("1");

  // call use data pelanggan
  const { dataPelanggan, isLoadingPelanggan } = useDataPelanggan({
    page,
    search,
  });

  const currentPage = dataPelanggan?.data?.meta?.currentPage ?? 1;
  const totalPage = dataPelanggan?.data?.meta?.totalPage ?? 1;

  const pages = generatePageNumbers(currentPage, totalPage, 3);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPage) return;
    setPage(String(page));
  };

  const isPrev = currentPage > 1;
  const isNext = currentPage < totalPage!;

  //   is existing data pelanggan
  const isExistDataPelanggan: boolean =
    !isLoadingPelanggan && dataPelanggan?.data
      ? dataPelanggan?.data?.data?.length > 0
        ? true
        : false
      : false;

  return {
    dataPelanggan,
    isLoadingPelanggan,
    handleSearch: setSearch,
    handlePage: setPage,
    pages,
    goTo,
    isPrev,
    isNext,
    currentPage,
    isExistDataPelanggan,
  };
};

export default useModalChoosePelanggan;
