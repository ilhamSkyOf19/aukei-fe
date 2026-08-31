import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

import useHighlight from "../../../../hooks/useHighlight";

import { StockOpnameDetailServices } from "../../../../services/stockOpnameDetail.service";

import type { UpdateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";

import type { StatusStockOpnameType } from "../../../../types/constant.type";

import { StockOpnameDetailValidation } from "../../../../validations/stockOpnameDetail.validation";

import type { ErrorResponse } from "../../../../types/response.type";
import useDeleteStockOpnameDetail from "../../../../hooks/useDeleteStockOpnameDetail";

const useShowStockOpname = (params: {
  status?: StatusStockOpnameType;
  handleSetToast: (value: string) => void;
  stockOpnameId?: number;
}) => {
  const { status, handleSetToast, stockOpnameId } = params;

  // ============================================================
  // QUERY CLIENT
  // ============================================================

  const queryClient = useQueryClient();

  // ============================================================
  // NAVIGATION
  // ============================================================

  const navigate = useNavigate();

  const currentPathname = useLocation().pathname;

  // ============================================================
  // HIGHLIGHT
  // ============================================================

  const {
    handleSetIsHighlight: handleSetIsActiveAksi,
    isHighlight: isActiveAksi,
  } = useHighlight();

  // ============================================================
  // MODAL DELETE
  // ============================================================
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeleteStockOpnameDetail({
    handleSetToast,
    status,
    stockOpnameId,
  });

  // ============================================================
  // UPDATE STATE
  // ============================================================

  const [dataUpdate, setDataUpdate] = useState<
    | (UpdateStockOpnameDetailType & {
        id: number;
      })
    | null
  >(null);

  // ============================================================
  // FORM UPDATE
  // ============================================================

  const {
    control,
    setValue,
    formState: { isDirty },
    reset,
    handleSubmit,
  } = useForm<UpdateStockOpnameDetailType>({
    resolver: zodResolver(StockOpnameDetailValidation.UPDATE),
  });

  // ============================================================
  // CONTROLLER
  // ============================================================

  const stokFisikController = useController({
    control,
    name: "stokFisik",
  });

  // ============================================================
  // SET DATA UPDATE
  // ============================================================

  const handleSetDataUpdate = (params: {
    data:
      | (UpdateStockOpnameDetailType & {
          id: number;
        })
      | null;
  }) => {
    const { data } = params;

    if (!data) return;

    setDataUpdate({
      id: data.id,
      produkId: data.produkId,
      stokFisik: data.stokFisik,
    });

    setValue("produkId", data.produkId);
    setValue("stokFisik", data.stokFisik);
  };

  // ============================================================
  // CLEAR UPDATE
  // ============================================================

  const handleClearDataUpdate = () => {
    reset();

    setDataUpdate(null);
  };

  // ============================================================
  // UPDATE
  // ============================================================

  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (params: {
        id: number;
        status: string;
        req: UpdateStockOpnameDetailType;
      }) => StockOpnameDetailServices.update(params),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["stock-opname-detail"],
        });

        navigate(currentPathname, {
          state: {
            toast: "updated_stock_opname_detail",
          },
        });

        setDataUpdate(null);

        reset();
      },

      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          console.log(err.response?.data);
        }
      },
    },
  );

  // ============================================================
  // HANDLE UPDATE
  // ============================================================

  const onSubmit = async (data: UpdateStockOpnameDetailType) => {
    try {
      if (!dataUpdate || !status) return;

      await mutateUpdate({
        id: dataUpdate.id,
        status: status.toLowerCase(),
        req: {
          produkId: dataUpdate.produkId,
          stokFisik: data.stokFisik,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    // highlight
    handleSetIsActiveAksi,
    isActiveAksi,

    // delete
    modalDeleteRef,
    handleCloseModalDelete,
    handleShowModalDelete,
    handleDelete,
    isPendingDelete,
    dataDelete,

    // update
    dataUpdate,
    handleSetDataUpdate,
    handleClearDataUpdate,
    handleSubmit,
    onSubmit,
    isPendingUpdate,
    isDirty,
    stokFisikController,
  };
};

export default useShowStockOpname;
