import useModal from "../../../../hooks/useModal";

const useFormulirTambahProdukStockOpnameDetail = () => {
  const {
    modalRef: modalFormulirTambahBarangRef,
    handleCloseModal: handleCloseModalFormulirTambahBarang,
    handleShowModal: handleShowModalFormulirTambahBarang,
  } = useModal();

  return {
    handleShowModalFormulirTambahBarang,
    handleCloseModalFormulirTambahBarang,
    modalFormulirTambahBarangRef,
  };
};

export default useFormulirTambahProdukStockOpnameDetail;
