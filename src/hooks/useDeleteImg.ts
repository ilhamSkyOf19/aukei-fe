import { useMutation, useQueryClient } from "@tanstack/react-query";
import useModal from "./useModal";
import { ProdukServices } from "../services/produk.service";

const useDeleteImg = (params: { handleSetToast: (value: string) => void }) => {
  const { handleSetToast } = params;
  const queryClient = useQueryClient();

  // use modal
  const {
    modalRef: modalDeleteImgRef,
    handleShowModal: handleShowModalDeleteImg,
    handleCloseModal: handleCloseModalDeleteImg,
    idModal: idModalDeleteImg,
  } = useModal();

  // mutation
  const { mutateAsync: mutateDeleteImg, isPending: isPendingDeleteImg } =
    useMutation({
      mutationFn: (data: { id: number }) =>
        ProdukServices.deleteImg({ id: data.id }),
      onSuccess: (response) => {
        handleCloseModalDeleteImg();

        // query refetch
        queryClient.refetchQueries({
          queryKey: ["detail-produk", response.data?.id],
        });

        handleSetToast("deleted_img");
      },
      onError: (err) => {
        console.log(err);
      },
    });

  //   handle delete
  const handleDeleteImg = async (data: { id: number }) => {
    try {
      return await mutateDeleteImg(data);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    modalDeleteImgRef,
    handleShowModalDeleteImg,
    handleCloseModalDeleteImg,
    idModalDeleteImg,
    handleDeleteImg,
    isPendingDeleteImg,
  };
};

export default useDeleteImg;
