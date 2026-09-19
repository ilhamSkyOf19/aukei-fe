import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import type { StatusStockOpnameType } from "../types/constant.type";
import type { UpdateStockOpnameDetailType } from "../models/stockOpnameDetail.model";
import { StockOpnameDetailValidation } from "../validations/stockOpnameDetail.validation";
import { StockOpnameDetailServices } from "../services/stockOpnameDetail.service";
import type { ErrorResponse } from "../types/response.type";
import { useEffect } from "react";

const useUpdateProdukStockOpname = (params: {
  status?: StatusStockOpnameType;

  dataUpdate?: {
    produkId?: number;
    stokFisik?: number;
    jenisPenyesuaian?: UpdateStockOpnameDetailType["jenisPenyesuaian"];
  };

  setDataUpdate?: () => void;
}) => {
  const { status, dataUpdate, setDataUpdate } = params;

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const currentPathname = useLocation().pathname;

  // ============================================================
  // FORM
  // ============================================================

  const {
    control,
    formState: { isDirty, errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm<UpdateStockOpnameDetailType>({
    resolver: zodResolver(StockOpnameDetailValidation.UPDATE),
  });

  // use effect  reset
  useEffect(() => {
    reset({
      produkId: dataUpdate?.produkId ?? undefined,
      stokFisik: dataUpdate?.stokFisik ?? undefined,
      jenisPenyesuaian: dataUpdate?.jenisPenyesuaian,
    });
  }, [dataUpdate, reset]);

  // ============================================================
  // CONTROLLER
  // ============================================================

  const stokFisikController = useController({
    control,
    name: "stokFisik",
  });

  const jenisPenyesuaianController = useController({
    control,
    name: "jenisPenyesuaian",
  });

  // ============================================================
  // MUTATION
  // ============================================================

  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (params: { id: number; req: UpdateStockOpnameDetailType }) =>
        StockOpnameDetailServices.update({
          id: params.id,
          status: status?.toLowerCase() ?? "",
          req: params.req,
        }),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["stock-opname-detail"],
        });

        navigate(currentPathname, {
          state: {
            toast: "updated_stock_opname_detail",
          },
        });

        setDataUpdate?.();

        reset();
      },

      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          console.log(err.response?.data);
        }
      },
    },
  );

  return {
    // form
    control,
    reset,
    handleSubmit,
    isDirty,

    // controller
    stokFisikController,
    jenisPenyesuaianController,

    // mutation
    mutateUpdate,
    isPendingUpdate,

    setValue,

    errors,
  };
};

export default useUpdateProdukStockOpname;
