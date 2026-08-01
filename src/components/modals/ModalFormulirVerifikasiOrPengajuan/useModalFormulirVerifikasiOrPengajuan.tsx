import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { PengajuanBarangValidations } from "../../../validations/pengajuanBarang.validation";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
  type RoleInternalType,
  type StatusInventoriType,
} from "../../../types/constant.type";
import { PengajuanBarangMasukServices } from "../../../services/pengajuanBarangMasuk.service";
import { PengajuanBarangKeluarServices } from "../../../services/pengajuanBarangkeluar.service";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";

const useModalFormulirVerifikasiOrPengajuan = (params: {
  barangMasukId?: number;
  barangKeluarId?: number;
  handleCloseModal: () => void;
  role?: RoleInternalType;
  handleSetAlert?: (data: string) => void;
}) => {
  // get params
  const {
    barangKeluarId,
    barangMasukId,
    handleCloseModal,
    role,
    handleSetAlert,
  } = params;

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
        ? PengajuanBarangValidations.KETERANGAN
        : PengajuanBarangValidations.KETERANGAN_PENGAJUAN,
    ),
  });

  //   mutation
  const {
    mutateAsync: mutateVerifikasiOrPengajuan,
    isPending: isPendingVerifikasiOrPengajuan,
  } = useMutation({
    mutationFn: (data: {
      id: number;
      status: Exclude<
        StatusInventoriType,
        "DRAFT" | "PENDING" | "CANCELLED" | "POSTED"
      >;
      keterangan?: string;
    }) => {
      if (role === ROLE_INTERNAL_TYPE.OWNER) {
        // verifikasi
        if (barangMasukId) {
          return PengajuanBarangMasukServices.verifikasi({
            barangMasukId: data.id,
            status: data.status,
            keterangan: data.keterangan,
          });
        } else {
          return PengajuanBarangKeluarServices.verifikasi({
            barangKeluarId: data.id,
            status: data.status,
            keterangan: data.keterangan,
          });
        }
      } else {
        // pengajuan
        if (barangMasukId) {
          return PengajuanBarangMasukServices.pengajuan({
            barangMasukId: data.id,
            keterangan: data.keterangan,
          });
        } else {
          return PengajuanBarangKeluarServices.pengajuan({
            barangKeluarId: data.id,
            keterangan: data.keterangan,
          });
        }
      }
    },
    onSuccess: () => {
      // invalidate queries
      queryClient.invalidateQueries({
        queryKey: [
          barangMasukId ? "barang-masuk-detail" : "barang-keluar-detail",
          barangMasukId ?? barangKeluarId,
        ],
      });

      // close modal
      handleCloseModal();

      // set toast
      navigate(currentPathname, {
        state: {
          toast:
            role === ROLE_INTERNAL_TYPE.OWNER
              ? "rejected_verifikasi"
              : "send_pengajuan",
        },
      });
    },
    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (
          err?.response?.data?.meta?.customField?.includes(
            "empty_barang_keluar",
          )
        ) {
          handleSetAlert?.("empty_barang_keluar");
        }

        if (
          err?.response?.data?.meta?.customField?.includes("stok_not_enough")
        ) {
          handleSetAlert?.("stok_not_enough");
        }
      }
    },
  });

  //   on submit
  const onSubmit = async (data: { keterangan?: string }) => {
    try {
      if (!barangMasukId && !barangKeluarId) return;

      await mutateVerifikasiOrPengajuan({
        id: barangMasukId ?? barangKeluarId ?? 0,
        status: STATUS_INVENTORI_TYPE.REJECTED,
        keterangan: data.keterangan,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPendingVerifikasiOrPengajuan,
  };
};

export default useModalFormulirVerifikasiOrPengajuan;
