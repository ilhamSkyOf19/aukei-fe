import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLocation, useNavigate } from "react-router-dom";

import { PengajuanBarangValidations } from "../../../validations/pengajuanBarang.validation";

import {
  ROLE_INTERNAL_TYPE,
  STATUS_STOCK_OPNAME_TYPE,
  type RoleInternalType,
  type StatusInventoriType,
} from "../../../types/constant.type";

import { PengajuanBarangMasukServices } from "../../../services/pengajuanBarangMasuk.service";

import { PengajuanBarangKeluarServices } from "../../../services/pengajuanBarangkeluar.service";

import { PengajuanStockOpnameServices } from "../../../services/pengajuanStockOpname.service";

import axios from "axios";

import type { ErrorResponse } from "../../../types/response.type";

type FormType = {
  keterangan?: string;
};

type Params = {
  barangMasukId?: number;

  barangKeluarId?: number;

  stockOpnameId?: number;

  handleCloseModal: () => void;

  role?: RoleInternalType;

  type?: "tolak" | "pengajuan";

  handleSetAlert?: (data: string) => void;
};

const useModalFormulirVerifikasiOrPengajuanStockOpname = (params: Params) => {
  // ============================================================
  // PARAMS
  // ============================================================

  const {
    barangKeluarId,

    barangMasukId,

    stockOpnameId,

    handleCloseModal,

    role,

    handleSetAlert,
  } = params;

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
  // FORM
  // ============================================================

  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(
      role === ROLE_INTERNAL_TYPE.OWNER
        ? PengajuanBarangValidations.KETERANGAN
        : PengajuanBarangValidations.KETERANGAN_PENGAJUAN,
    ),
  });

  // ============================================================
  // MUTATION
  // ============================================================

  const {
    mutateAsync: mutateVerifikasiOrPengajuan,

    isPending: isPendingVerifikasiOrPengajuan,
  } = useMutation({
    mutationFn: async (data: {
      id: number;

      status:
        | Exclude<
            StatusInventoriType,
            "DRAFT" | "PENDING" | "CANCELLED" | "POSTED"
          >
        | typeof STATUS_STOCK_OPNAME_TYPE.REJECTED;

      keterangan?: string;
    }) => {
      // ======================================================
      // STOCK OPNAME
      // ======================================================

      if (stockOpnameId) {
        // OWNER
        if (role === ROLE_INTERNAL_TYPE.OWNER) {
          return PengajuanStockOpnameServices.verifikasi({
            stockOpnameId: data.id,

            status: STATUS_STOCK_OPNAME_TYPE.REJECTED,

            keterangan: data.keterangan,
          });
        }

        // KASIR
        return PengajuanStockOpnameServices.ajukan({
          stockOpnameId: data.id,

          keterangan: data.keterangan,
        });
      }

      if (barangMasukId) {
        if (role === ROLE_INTERNAL_TYPE.OWNER) {
          return PengajuanBarangMasukServices.verifikasi({
            barangMasukId: data.id,

            status: data.status as Exclude<
              StatusInventoriType,
              "DRAFT" | "PENDING" | "CANCELLED" | "POSTED"
            >,

            keterangan: data.keterangan,
          });
        }

        return PengajuanBarangMasukServices.pengajuan({
          barangMasukId: data.id,

          keterangan: data.keterangan,
        });
      }

      // ======================================================
      // BARANG KELUAR
      // ======================================================

      if (role === ROLE_INTERNAL_TYPE.OWNER) {
        return PengajuanBarangKeluarServices.verifikasi({
          barangKeluarId: data.id,

          status: data.status as Exclude<
            StatusInventoriType,
            "DRAFT" | "PENDING" | "CANCELLED" | "POSTED"
          >,

          keterangan: data.keterangan,
        });
      }

      return PengajuanBarangKeluarServices.pengajuan({
        barangKeluarId: data.id,

        keterangan: data.keterangan,
      });
    },

    // ========================================================
    // SUCCESS
    // ========================================================

    onSuccess: () => {
      // STOCK OPNAME
      if (stockOpnameId) {
        queryClient.invalidateQueries({
          queryKey: ["stock-opname-detail", stockOpnameId],
        });

        queryClient.invalidateQueries({
          queryKey: ["riwayat-pengajuan-stock-opname", stockOpnameId],
        });

        queryClient.invalidateQueries({
          queryKey: ["notifikasi-global"],
        });

        queryClient.invalidateQueries({
          queryKey: ["notifikasi-produk"],
        });
      }

      // BARANG MASUK
      if (barangMasukId) {
        queryClient.invalidateQueries({
          queryKey: ["barang-masuk-detail", barangMasukId],
        });

        queryClient.invalidateQueries({
          queryKey: ["riwayat-pengajuan-barang-masuk", barangMasukId],
        });
      }

      // BARANG KELUAR
      if (barangKeluarId) {
        queryClient.invalidateQueries({
          queryKey: ["barang-keluar-detail", barangKeluarId],
        });

        queryClient.invalidateQueries({
          queryKey: ["riwayat-pengajuan-barang-keluar", barangKeluarId],
        });
      }

      // CLOSE MODAL
      handleCloseModal();

      // TOAST
      navigate(currentPathname, {
        state: {
          toast:
            role === ROLE_INTERNAL_TYPE.OWNER
              ? "rejected_verifikasi"
              : "send_pengajuan",
        },
      });
    },

    // ========================================================
    // ERROR
    // ========================================================

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

        if (err?.response?.data?.meta?.customField?.includes("empty_produk")) {
          handleSetAlert?.("empty_produk");
        }
      }
    },
  });

  // ============================================================
  // SUBMIT
  // ============================================================

  const onSubmit = async (data: FormType) => {
    try {
      const id = stockOpnameId ?? barangMasukId ?? barangKeluarId;

      if (!id) {
        return;
      }

      await mutateVerifikasiOrPengajuan({
        id,

        status: STATUS_STOCK_OPNAME_TYPE.REJECTED,

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

export default useModalFormulirVerifikasiOrPengajuanStockOpname;
