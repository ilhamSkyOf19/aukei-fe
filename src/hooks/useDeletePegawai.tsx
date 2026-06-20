import useModal from "./useModal";
import { useMutation } from "@tanstack/react-query";
import { PegawaiServices } from "../services/pegawai.service";

const useDeletePegawai = (params: {
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
    dataModal: dataDelete,
  } = useModal<{ nama?: string }>();

  // use mutation delete
  const { mutateAsync: mutateDelete, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (id: number) => PegawaiServices.delete(id),
      onSuccess: () => {
        // refetch
        params.handleInvalidate?.();

        params.handleToast?.("deleted_pegawai");

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

export default useDeletePegawai;
