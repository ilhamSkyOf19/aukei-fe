import { useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import useConfirm from "../../../hooks/useConfirm";
import { STATUS_INVENTORI_TYPE } from "../../../types/constant.type";
import { BarangKeluarServices } from "../../../services/barangKeluar.service";
import useDeleteBarangKeluar from "../../../hooks/useDeleteBarangKeluar";

const useBarangKeluarDetail = () => {
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
  const {
    data: dataBarangKeluarDetail,
    isLoading: isLoadingBarangKeluarDetail,
  } = useQuery({
    queryKey: ["barang-keluar-detail", validatedId],
    queryFn: () => BarangKeluarServices.detail({ id: validatedId! }),
    enabled: !!validatedId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // mutate posting
  const { mutateAsync: mutatePosting, isPending: isPendingPosting } =
    useMutation({
      mutationFn: (id: number) => BarangKeluarServices.posted(id),
      onSuccess: () => {
        // handle toast
        handleSetToast("posted");

        // revalidated
        queryClient.invalidateQueries({
          queryKey: ["barang-keluar-detail", validatedId],
        });
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes(
              "empty_barang_keluar",
            )
          ) {
            handleSetAlert("empty_barang_keluar");
          }
        }
      },
    });

  // handle posting
  const handlePosting = async (id: number) => {
    try {
      if (dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED)
        return;

      if (dataBarangKeluarDetail?.data?.detailBarangKeluars.length === 0) {
        handleSetAlert("empty_barang_keluar");
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
    mutationFn: (id: number) => BarangKeluarServices.cancelPosted(id),

    onSuccess: () => {
      // handle toast
      handleSetToast("cancel_posted");

      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-keluar-detail", validatedId],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // is expired
  const isExpired =
    dataBarangKeluarDetail?.data &&
    Date.now() - new Date(dataBarangKeluarDetail?.data?.createdAt).getTime() >
      24 * 60 * 60 * 1000;

  // handle posting
  const handleCancelPosting = async (id: number) => {
    try {
      if (
        dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
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
    dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED;
  const isStatusDraft =
    dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT;

  // use delete barang masuk
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeleteBarangKeluar({
    redirect: () => {
      navigate("/dashboard/inventori", {
        state: {
          toast: "deleted_barang_keluar",
        },
      });
    },
  });

  return {
    dataBarangKeluarDetail,
    isLoadingBarangKeluarDetail,
    alert,
    toast,
    handlePosting,
    isPendingPosting,
    modalKonfirmasiPostingRef,
    handleCancelPosting,
    handleConfirmPosting,
    handleCancelConfirmPosting,
    isPendingCancelPosting,
    isStatusPosted,
    isStatusDraft,
    isExpired,
    modalDeleteRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    dataDelete,
    handleDelete,
    isPendingDelete,
    handleSetToast,
    handleSetAlert,
  };
};

export default useBarangKeluarDetail;
