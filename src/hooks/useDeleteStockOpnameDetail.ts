import { useMutation, useQueryClient } from "@tanstack/react-query";

import useModal from "./useModal";

import { StockOpnameDetailServices } from "../services/stockOpnameDetail.service";
import type { StatusStockOpnameType } from "../types/constant.type";

type DataDeleteType = {
  namaProduk?: string;
};

type Params = {
  stockOpnameId?: number | null;

  status?: StatusStockOpnameType | null;

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
      handleCloseModal();

      handleSetToast?.("deleted_stock_opname_detail");

      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["stock-opname-detail", stockOpnameId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["daftar-produk-stock-opname", stockOpnameId],
        }),
      ]);
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
