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

const useModalFormulirVerifikasiOrPengajuan = (params: {
  barangMasukId?: number;
  barangKeluarId?: number;
  handleCloseModal: () => void;
  role?: RoleInternalType;
}) => {
  // get params
  const { barangKeluarId, barangMasukId, handleCloseModal, role } = params;

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
    mutateAsync: mutateVerifikasiRejected,
    isPending: isPendingVerifikasiRejected,
  } = useMutation({
    mutationFn: (data: {
      id: number;
      status: Exclude<
        StatusInventoriType,
        "DRAFT" | "PENDING" | "CANCELLED" | "POSTED"
      >;
      keterangan?: string;
    }) => {
      if (barangMasukId) {
        if (role === ROLE_INTERNAL_TYPE.OWNER) {
          // verifikasi
          return PengajuanBarangMasukServices.verifikasi({
            barangMasukId: data.id,
            status: data.status,
            keterangan: data.keterangan,
          });
        } else {
          // pengajuan
          return PengajuanBarangMasukServices.pengajuan({
            barangMasukId: data.id,
            keterangan: data.keterangan,
          });
        }
      } else {
        return PengajuanBarangKeluarServices.verifikasi({
          barangKeluarId: data.id,
          status: data.status,
          keterangan: data.keterangan,
        });
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
      console.log(err);
    },
  });

  //   on submit
  const onSubmit = async (data: { keterangan?: string }) => {
    try {
      if (!barangMasukId && !barangKeluarId) return;

      await mutateVerifikasiRejected({
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
    isPendingVerifikasiRejected,
  };
};

export default useModalFormulirVerifikasiOrPengajuan;
