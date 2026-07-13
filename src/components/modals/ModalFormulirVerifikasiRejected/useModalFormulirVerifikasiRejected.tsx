import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { PengajuanBarangValidations } from "../../../validations/pengajuanBarang.validation";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../types/constant.type";
import { PengajuanBarangMasukServices } from "../../../services/pengajuanBarangMasuk.service";

const useModalFormulirVerifikasiRejected = (params: {
  barangMasukId?: number;
  barangKeluarId?: number;
  handleCloseModal: () => void;
}) => {
  // get params
  const { barangKeluarId, barangMasukId, handleCloseModal } = params;

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
  } = useForm<{ keterangan: string }>({
    resolver: zodResolver(PengajuanBarangValidations.KETERANGAN),
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
      keterangan: string;
    }) => {
      if (barangMasukId) {
        return PengajuanBarangMasukServices.verifikasi({
          barangMasukId: data.id,
          status: data.status,
          keterangan: data.keterangan,
        });
      } else {
        return PengajuanBarangMasukServices.verifikasi({
          barangMasukId: data.id,
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
          toast: "rejected_verifikasi",
        },
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   on submit
  const onSubmit = async (data: { keterangan: string }) => {
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

export default useModalFormulirVerifikasiRejected;
