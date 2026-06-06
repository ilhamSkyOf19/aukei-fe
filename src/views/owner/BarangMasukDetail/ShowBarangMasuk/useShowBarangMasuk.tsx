import { useMutation, useQueryClient } from "@tanstack/react-query";
import useHighlight from "../../../../hooks/useHighlight";
import useModal from "../../../../hooks/useModal";
import { BarangMasukDetailServices } from "../../../../services/barangMasukDetail.service";
import { useLocation, useNavigate } from "react-router-dom";
import type { StatusInventoriType } from "../../../../types/constant.type";

const useShowBarangMasuk = (params: { status?: StatusInventoriType }) => {
  const { status } = params;

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use modal
  const {
    modalRef: modalDeleteRef,
    handleCloseModal: handleCloseModalDelete,
    handleShowModal: handleShowModalDelete,
    idModal: idDelete,
    dataDelete,
  } = useModal();

  //   use mutation
  const { mutateAsync: mutateDelete, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (data: { id: number; status: StatusInventoriType }) =>
        BarangMasukDetailServices.delete(data),
      onSuccess: () => {
        // invalidate
        queryClient.invalidateQueries({ queryKey: ["barang-masuk-detail"] });

        // set toast
        navigate(currentPathname, {
          state: {
            toast: "deleted_barang_masuk_detail",
          },
        });

        // handle close
        handleCloseModalDelete();
      },
      onError: (err) => {
        console.log(err);
        handleCloseModalDelete();
      },
    },
  );

  //   handle delete
  const handleDelete = async () => {
    try {
      if (!idDelete || !status) return;

      await mutateDelete({
        id: idDelete,
        status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // highlight
  const {
    handleSetIsHighlight: handleSetIsActiveAksi,
    isHighlight: isActiveAksi,
    wrapperRef,
  } = useHighlight();

  return {
    handleSetIsActiveAksi,
    isActiveAksi,
    wrapperRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    modalDeleteRef,
    isPendingDelete,
    handleDelete,
    dataDelete,
  };
};

export default useShowBarangMasuk;
