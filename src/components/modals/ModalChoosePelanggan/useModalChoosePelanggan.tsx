import useDataPelanggan from "../../../hooks/useDataPelanggan";
import { handlePagination } from "../../../helpers/helpers";
import { useState } from "react";
import useModal from "../../../hooks/useModal";

const useModalChoosePelanggan = (params: {
  handleCloseModalChoosePelanggan: () => void;
  handleShowModalChoosePelanggan: () => void;
}) => {
  const { handleCloseModalChoosePelanggan, handleShowModalChoosePelanggan } =
    params;

  // use modal formulir pelanggan
  const {
    modalRef: modalFormulirPelangganRef,
    handleCloseModal: closeModalFormulirPelanggan,
    handleShowModal: showModalFormulirPelanggan,
  } = useModal();

  // handle show modal formulir pelanggan
  const handleShowModalFormulirPelanggan = () => {
    // close modal choose pelanggan
    handleCloseModalChoosePelanggan();

    // show modal formulir pelanggan
    showModalFormulirPelanggan();
  };

  // handle close modal formulir pelanggan
  const handleCloseModalFormulirPelanggan = () => {
    // close modal formulir pelanggan
    closeModalFormulirPelanggan();

    // show modal choose pelanggan
    handleShowModalChoosePelanggan();
  };

  // filter search
  const [search, setSearch] = useState<string>("");

  // filter page
  const [page, setPage] = useState<string>("1");

  // call use data pelanggan
  const { dataPelanggan, isLoadingPelanggan } = useDataPelanggan({
    page,
    search,
  });

  // handle pagination
  const { goTo, isNext, isPrev, pages } = handlePagination({
    setPage,
    currentPage: dataPelanggan?.data?.meta?.currentPage,
    totalPage: dataPelanggan?.data?.meta?.totalPage,
  });

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
    currentPage: dataPelanggan?.data?.meta?.currentPage || 1,
    isExistDataPelanggan,
    modalFormulirPelangganRef,
    handleShowModalFormulirPelanggan,
    handleCloseModalFormulirPelanggan,
  };
};

export default useModalChoosePelanggan;
