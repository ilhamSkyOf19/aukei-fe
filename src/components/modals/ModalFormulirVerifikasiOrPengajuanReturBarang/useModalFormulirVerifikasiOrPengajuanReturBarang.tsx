import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
  type RoleInternalType,
  type StatusInventoriType,
} from "../../../types/constant.type";
import { ReturBarangValidations } from "../../../validations/returBarang.validation";
import { ReturBarangServices } from "../../../services/returBarang.service";

const useModalFormulirVerifikasiOrPengajuanReturBarang = (params: {
  returId?: number;
  kodeReferensi?: string;
  handleCloseModal: () => void;
  role?: RoleInternalType;
  handleSetAlert?: (data: string) => void;
}) => {
  // get params
  const { kodeReferensi, handleCloseModal, role, handleSetAlert, returId } =
    params;

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    keterangan?: string;
  }>({
    resolver: zodResolver(
      role === ROLE_INTERNAL_TYPE.OWNER
        ? ReturBarangValidations.KETERANGAN
        : ReturBarangValidations.KETERANGAN_PENGAJUAN,
    ),
  });

  //   mutation verifikasi
  const { mutateAsync: mutateVerifikasi, isPending: isPendingVerifikasi } =
    useMutation({
      mutationFn: (data: {
        kodeReferensi: string;
        status: Exclude<
          StatusInventoriType,
          "DRAFT" | "PENDING" | "CANCELLED" | "POSTED"
        >;
        keterangan?: string;
      }) =>
        ReturBarangServices.verifikasi({
          kodeReferensi: data.kodeReferensi,
          status: data.status,
          keterangan: data.keterangan,
        }),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["retur-barang-detail", returId],
        });

        queryClient.invalidateQueries({
          queryKey: ["riwayat-pengajuan-retur-barang", returId],
        });

        handleCloseModal();

        navigate(currentPathname, {
          state: {
            toast: "rejected_verifikasi",
          },
        });
      },

      onError: (err) => {
        console.log(err);
      },
    });

  // pengajuan
  const { mutateAsync: mutatePengajuan, isPending: isPendingPengajuan } =
    useMutation({
      mutationFn: (data: { returId: number; keterangan?: string }) =>
        ReturBarangServices.pengajuan({
          id: data.returId,
          keterangan: data.keterangan,
        }),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["retur-barang-detail", returId],
        });

        queryClient.invalidateQueries({
          queryKey: ["riwayat-pengajuan-retur-barang", returId],
        });

        handleCloseModal();

        navigate(currentPathname, {
          state: {
            toast: "send_pengajuan",
          },
        });
      },

      onError: (err) => {
        console.log(err);
      },
    });

  const onSubmit = async (data: { keterangan?: string }) => {
    try {
      if (role === ROLE_INTERNAL_TYPE.OWNER) {
        if (!kodeReferensi) return;
        await mutateVerifikasi({
          kodeReferensi,
          status: STATUS_INVENTORI_TYPE.REJECTED,
          keterangan: data.keterangan,
        });
      } else {
        if (!returId) return;
        await mutatePengajuan({
          returId,
          keterangan: data.keterangan,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPendingVerifikasi,
    isPendingPengajuan,
  };
};

export default useModalFormulirVerifikasiOrPengajuanReturBarang;
