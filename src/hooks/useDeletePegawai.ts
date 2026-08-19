import useModal from "./useModal";
import { useMutation } from "@tanstack/react-query";
import { PegawaiServices } from "../services/pegawai.service";
import axios from "axios";
import type { ErrorResponse } from "../types/response.type";

const useDeletePegawai = (params: {
  handleInvalidate?: () => Promise<void>;
  handleToast?: (toast: string) => void;
  redirect?: () => void;
  handleShowModalFailedDelete?: () => Promise<void>;
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
      onError: async (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (err.response?.data?.meta?.message?.includes("Relationship")) {
            // close modal delete
            handleCloseModalDelete();

            // confirm
            await params.handleShowModalFailedDelete?.();

            return;
          }
        }
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
