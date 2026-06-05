import { useQuery } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../../services/barangMasuk.service";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../hooks/useFilter";
import { useToastAnimation } from "../../../../hooks/useToast";
import useModal from "../../../../hooks/useModal";

const useBarangMasuk = () => {
  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // use modal formulir barang masuk
  const {
    modalRef: modalFormulirBarangMasukRef,
    handleCloseModal: handleCloseModalFormulirBarangMasuk,
    handleShowModal: handleShowModalFormulirBarangMasuk,
  } = useModal();

  // filter sort
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // filter limit
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // filter page
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  //   toast
  const { toast } = useToastAnimation();

  // query
  const { data: dataBarangMasuk, isLoading: isLoadingBarangMasuk } = useQuery({
    queryKey: ["barang-masuk", search, sort, limit, page],
    queryFn: () =>
      BarangMasukServices.all({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(limit && { limit }),
        ...(page && { page }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is exist data
  const isExistDataBarangMasuk: boolean =
    !isLoadingBarangMasuk && dataBarangMasuk?.data?.data
      ? dataBarangMasuk?.data?.data?.length > 0
        ? true
        : false
      : false;

  return {
    dataBarangMasuk,
    isLoadingBarangMasuk,
    handleSearch,
    handleSort,
    handleLimit,
    handlePage,
    toast,
    isExistDataBarangMasuk,
    modalFormulirBarangMasukRef,
    handleCloseModalFormulirBarangMasuk,
    handleShowModalFormulirBarangMasuk,
  };
};

export default useBarangMasuk;
