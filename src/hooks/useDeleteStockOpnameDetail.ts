import { useMutation, useQueryClient } from "@tanstack/react-query";

import useModal from "./useModal";

import { StockOpnameDetailServices } from "../services/stockOpnameDetail.service";

type DataDeleteType = {
  namaProduk?: string;

  kodeProduk?: string;

  kodeReferensi?: string;
};

type Params = {
  stockOpnameId?: number;

  status?: string;

  handleSetToast?: (type: string) => void;
};

const useDeleteStockOpnameDetail = (params: Params) => {
  const { stockOpnameId, status, handleSetToast } = params;

  const queryClient = useQueryClient();

  const { modalRef, handleShowModal, handleCloseModal, idModal, dataModal } =
    useModal<DataDeleteType>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: number) =>
      StockOpnameDetailServices.delete({
        id,

        status: status?.toLowerCase() ?? "draft",
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["stock-opname-detail", stockOpnameId],
      });

      handleSetToast?.("deleted_stock_opname_detail");

      handleCloseModal();
    },
  });

  const handleDelete = async () => {
    if (!idModal) {
      return;
    }

    await mutateAsync(idModal);
  };

  // const handleShowModalDelete = (
  //   id?: number,

  //   data?: DataDeleteType,
  // ) => {
  //   if (!id) {
  //     return;
  //   }

  //   handleShowModal(id, data);
  // };

  return {
    modalDeleteRef: modalRef,

    dataDelete: dataModal,

    handleCloseModalDelete: handleCloseModal,

    handleDelete,

    isPendingDelete: isPending,

    handleShowModalDelete: handleShowModal,
  };
};

export default useDeleteStockOpnameDetail;
