import useModal from "./useModal";
import { useMutation } from "@tanstack/react-query";
import { PelangganServices } from "../services/pelanggan.service";
import axios from "axios";
import type { ErrorResponse } from "../types/response.type";

const useDeletePelanggan = (params: {
  handleInvalidate?: () => Promise<void>;
  handleToast?: (toast: string) => void;
  redirect?: () => void;
  handleShowModalFailedDelete: (
    id?: number | undefined,
    data?:
      | {
          data?:
            | {
                nama: string;
              }
            | undefined;
          message: string;
          description: string;
        }
      | undefined,
  ) => void;
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
      mutationFn: (id: number) => PelangganServices.delete({ id }),
      onSuccess: () => {
        // refetch
        params.handleInvalidate?.();

        params.handleToast?.("deleted_pelanggan");

        params.redirect?.();

        // close modal
        handleCloseModalDelete();
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err.response?.data?.meta?.message.includes("Relationship") &&
            err.response.data.meta.customField?.includes("Pelanggan")
          ) {
            // show modal faied delete
            params.handleShowModalFailedDelete(undefined, {
              message: `Mohon maaf pelanggan ${dataDelete?.nama} yang dipilih tidak dapat dihapus karena memiliki riwayat transaksi`,
              description: "Silahkan pilih pelanggan lain",
            });

            // close modal
            handleCloseModalDelete();
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

export default useDeletePelanggan;
