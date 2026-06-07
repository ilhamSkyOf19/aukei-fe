import useModal from "./useModal";
import { useMutation } from "@tanstack/react-query";
import { BarangMasukServices } from "../services/barangMasuk.service";

const useDeleteBarangMasuk = (params: {
  handleInvalidate?: () => Promise<void>;
  handleToast?: (toast: string) => void;
  redirect?: () => void;
}) => {
  // use modal delete
  const {
    modalRef: modalDeleteRef,
    handleShowModal: handleShowModalDelete,
    handleCloseModal: handleCloseModalDelete,
    idModal: idModalDelete,
    dataDelete: dataDelete,
  } = useModal();

  // use mutation delete
  const { mutateAsync: mutateDelete, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (id: number) => BarangMasukServices.delete(id),
      onSuccess: () => {
        // refetch
        params.handleInvalidate?.();

        params.handleToast?.("deleted_barang_masuk");

        params.redirect?.();

        // close modal
        handleCloseModalDelete();
      },
      onError: (err) => {
        console.log(err);
      },
    },
  );

  // handle delete
  const handleDelete = async () => {
    try {
      if (!idModalDelete) return;

      await mutateDelete(idModalDelete);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    modalDeleteRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    dataDelete,
    handleDelete,
    isPendingDelete,
  };
};

export default useDeleteBarangMasuk;
