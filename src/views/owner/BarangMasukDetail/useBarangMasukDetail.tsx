import { useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../services/barangMasuk.service";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import useConfirm from "../../../hooks/useConfirm";
import { STATUS_INVENTORI_TYPE } from "../../../types/constant.type";

import useDeleteBarangMasuk from "../../../hooks/useDeleteBarangMasuk";

const useBarangMasukDetail = () => {
  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // show modal konfirmasi posting
  const {
    modalRef: modalKonfirmasiPostingRef,
    confirm,
    handleConfirm: handleConfirmPosting,
    handleCancel: handleCancelConfirmPosting,
  } = useConfirm();

  // handle

  // use alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // use toast
  const { toast, handleSetToast } = useToastAnimation();

  // get id from params
  const { id } = useParams<{ id: string }>();
  // parse
  const validatedId = parseId(id);

  // use query
  const { data: dataBarangMasukDetail, isLoading: isLoadingBarangMasukDetail } =
    useQuery({
      queryKey: ["barang-masuk-detail", validatedId],
      queryFn: () => BarangMasukServices.detail({ id: validatedId! }),
      enabled: !!validatedId,
      retry: false,
      refetchOnWindowFocus: false,
    });

  // mutate posting
  const { mutateAsync: mutatePosting, isPending: isPendingPosting } =
    useMutation({
      mutationFn: (id: number) => BarangMasukServices.posted(id),
      onSuccess: () => {
        // handle toast
        handleSetToast("posted");

        // revalidated
        queryClient.invalidateQueries({
          queryKey: ["barang-masuk-detail", validatedId],
        });
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes(
              "empty_barang_masuk",
            )
          ) {
            handleSetAlert("empty_barang_masuk");
          }
        }
      },
    });

  // handle posting
  const handlePosting = async (id: number) => {
    try {
      if (dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED)
        return;

      if (dataBarangMasukDetail?.data?.detailBarangMasuks.length === 0) {
        handleSetAlert("empty_barang_masuk");
        return;
      }

      // confirm
      const isConfirm = await confirm();

      if (!isConfirm) {
        return;
      }

      await mutatePosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  // mutate cancel posting
  const {
    mutateAsync: mutateCancelPosting,
    isPending: isPendingCancelPosting,
  } = useMutation({
    mutationFn: (id: number) => BarangMasukServices.cancelPosted(id),

    onSuccess: () => {
      // handle toast
      handleSetToast("cancel_posted");

      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // is expired
  const isExpired =
    dataBarangMasukDetail?.data &&
    Date.now() - new Date(dataBarangMasukDetail?.data?.createdAt).getTime() >
      24 * 60 * 60 * 1000;

  // handle posting
  const handleCancelPosting = async (id: number) => {
    try {
      if (
        dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
        isExpired
      )
        return;

      // confirm
      const isConfirm = await confirm();

      if (!isConfirm) {
        return;
      }

      await mutateCancelPosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  const isStatusPosted =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED;
  const isStatusDraft =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT;

  // use delete barang masuk
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeleteBarangMasuk({
    redirect: () => {
      navigate("/dashboard/inventori", {
        state: {
          toast: "deleted_barang_masuk",
        },
      });
    },
  });

  return {
    dataBarangMasukDetail,
    isLoadingBarangMasukDetail,

    alert,

    toast,

    handlePosting,
    isPendingPosting,
    handleCancelPosting,
    handleConfirmPosting,
    modalKonfirmasiPostingRef,
    handleCancelConfirmPosting,
    isPendingCancelPosting,
    isStatusDraft,
    isStatusPosted,
    isExpired,

    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    isPendingDelete,
    handleShowModalDelete,
    modalDeleteRef,
    handleSetToast,
    handleSetAlert,
  };
};

export default useBarangMasukDetail;
