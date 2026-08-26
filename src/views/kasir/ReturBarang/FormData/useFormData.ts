import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useController, useForm, useWatch } from "react-hook-form";

import axios from "axios";

import { ReturBarangServices } from "../../../../services/returBarang.service";

import type {
  DeleteReturnDetailParamsType,
  UpdateReturnDetailRequestType,
} from "../../../../models/returBarang.model";
import type { ErrorResponse } from "../../../../types/response.type";

interface UseUpdateReturnDetailParams {
  returnTransactionId: number;
  returnDetailId: number;
  transactionId: number;

  hargaBeliRetur?: number;
  quantityReturn?: number;
  totalRefund?: number;

  handleSetToast: (value: string) => void;
}

export const useFormData = ({
  returnTransactionId,
  returnDetailId,
  transactionId,
  hargaBeliRetur: initialHargaBeliRetur = 0,
  quantityReturn: initialQuantityReturn = 0,
  totalRefund: initialTotalRefund = 0,
  handleSetToast,
}: UseUpdateReturnDetailParams) => {
  const queryClient = useQueryClient();

  /**
   * ============================================================
   * FORM
   * ============================================================
   */
  const { control, setError, clearErrors, setValue } =
    useForm<UpdateReturnDetailRequestType>({
      defaultValues: {
        hargaBeliRetur: initialHargaBeliRetur,
        quantityReturn: initialQuantityReturn,
        totalRefund: initialTotalRefund,
      },
    });

  /**
   * ============================================================
   * CONTROLLER
   * ============================================================
   */
  const quantityReturnController = useController({
    control,
    name: "quantityReturn",
  });

  const controllerHargaBeli = useController({
    control,
    name: "hargaBeliRetur",
  });

  const controllerTotalRefund = useController({
    control,
    name: "totalRefund",
  });

  controllerHargaBeli.field.onBlur;

  /**
   * ============================================================
   * WATCH
   * ============================================================
   */
  const quantityReturn = useWatch({
    control,
    name: "quantityReturn",
  });

  const hargaBeliRetur = useWatch({
    control,
    name: "hargaBeliRetur",
  });

  const totalRefund = useWatch({
    control,
    name: "totalRefund",
  });

  /**
   * ============================================================
   * STATE
   * ============================================================
   *
   * Menyimpan request terakhir yang sudah dikirim.
   */
  const [lastSubmittedValue, setLastSubmittedValue] = useState<string | null>(
    null,
  );

  // refech
  const refetch = async () => [
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["return-draft-details", returnDetailId],
      }),

      queryClient.invalidateQueries({
        queryKey: ["transaction-for-retur-barang", transactionId],
      }),

      await queryClient.invalidateQueries({
        queryKey: ["return-details", returnTransactionId],
      }),
    ]),
  ];

  /**
   * ============================================================
   * MUTATION
   * ============================================================
   */
  const {
    mutateAsync: mutateUpdateReturnDetail,
    isPending: isPendingUpdateReturnDetail,
  } = useMutation({
    mutationFn: async (request: UpdateReturnDetailRequestType) => {
      return ReturBarangServices.updateReturnDetail({
        returnTransactionId,
        returnDetailId,
        req: request,
      });
    },

    onSuccess: async (response) => {
      clearErrors("quantityReturn");

      /**
       * Backend menghitung ulang total refund.
       *
       * Jangan tandai sebagai dirty karena ini
       * merupakan perubahan dari server.
       */
      if (typeof response.data?.totalRefund === "number") {
        setValue("totalRefund", response.data.totalRefund, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }

      handleSetToast("updated_data");

      /**
       * Karena combinedReturnDetails menggunakan
       * kedua sumber data ini, keduanya harus diperbarui.
       */
      await refetch();
    },

    onError: (error) => {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        if (
          error.response?.data.meta.customField?.includes(
            "return_quantity_exceeded",
          )
        ) {
          setError("quantityReturn", {
            message: "Jumlah retur melebihi quantity yang dipesan.",
          });
        }
      }
    },
  });

  /**
   * ============================================================
   * HANDLE BLUR / UPDATE
   * ============================================================
   *
   * Dipanggil ketika salah satu input kehilangan fokus.
   *
   * Ketiga nilai form diambil sekaligus sehingga
   * satu update selalu mengirim kondisi row terbaru.
   */
  const handleBlur = () => {
    if (
      typeof quantityReturn !== "number" ||
      typeof hargaBeliRetur !== "number" ||
      typeof totalRefund !== "number"
    ) {
      return;
    }

    const request: UpdateReturnDetailRequestType = {
      hargaBeliRetur,
      quantityReturn,
      totalRefund,
    };

    /**
     * Cegah request yang sama dikirim berkali-kali.
     */
    const requestKey = JSON.stringify(request);

    if (requestKey === lastSubmittedValue) {
      return;
    }

    setLastSubmittedValue(requestKey);

    mutateUpdateReturnDetail(request);
  };

  // mutate delete
  const {
    mutateAsync: handleDeleteReturnDetail,
    isPending: isPendingDeleteReturnDetail,
  } = useMutation({
    mutationFn: (request: DeleteReturnDetailParamsType) =>
      ReturBarangServices.deleteReturnDetail(request),
    onSuccess: async () => {
      await refetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return {
    /**
     * Controller
     */
    quantityReturnController,
    controllerHargaBeli,
    controllerTotalRefund,

    /**
     * Action
     */
    handleBlur,

    /**
     * Mutation
     */
    isPending: isPendingDeleteReturnDetail,

    /**
     * Delete
     */
    handleDeleteReturnDetail,
    isPendingDeleteReturnDetail,
  };
};
