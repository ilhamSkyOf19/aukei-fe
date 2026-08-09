import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReturBarangServices } from "../../../services/returBarang.service";
import { useMemo } from "react";
import useModal from "../../../hooks/useModal";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useAuthStore } from "../../../stores/authStore";
import { useToastAnimation } from "../../../hooks/useToast";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../types/constant.type";
import useConfirm from "../../../hooks/useConfirm";

const useReturBarangDetail = () => {
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const { toast, handleSetToast } = useToastAnimation();

  // handle back
  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -2).join("/"));
  };

  // query client
  const queryClient = useQueryClient();

  //   get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  // get retur barang id from params
  const { returBarangId } = useParams<{ returBarangId: string }>();

  // parse
  const validatedReturBarangId = parseId(returBarangId);

  //   alert
  const { alert, handleSetAlert } = useAlertAnimation();

  const {
    modalRef: modalFormulirVerifikasiOrPengajuan,
    handleShowModal: handleShowModalFormulirVerifikasiOrPengajuan,
    handleCloseModal: handleCloseModalFormulirVerifikasiOrPengajuan,
    dataModal: dataModalFormulirVerifikasiOrPengajuan,
  } = useModal<{ type: "pengajuan" | "tolak" }>();

  // modal konfirmasi verifikasi
  const {
    modalRef: modalKonfirmasiVerifikasiRef,
    confirm: confirmModalKonfirmasiVerifikasi,
    handleCancel: handleCancelModalKonfirmasiVerifikasi,
    handleCloseModal: handleCloseModalKonfirmasiVerifikasi,
    handleConfirm: handleKonfirmasiModalKonfirmasiVerifikasi,
    data: dataModalKonfirmasiVerifikasi,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

  // use query
  const { data: dataReturBarang, isLoading: isLoadingReturBarang } = useQuery({
    queryKey: ["retur-barang-detail", validatedReturBarangId],
    queryFn: () =>
      ReturBarangServices.findById({ id: validatedReturBarangId! }),
    enabled: !!validatedReturBarangId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   retur details
  const returDetailsMap = new Map(
    dataReturBarang?.data?.returDetails.map((item) => [
      item.transactionDetailId,
      item,
    ]),
  );

  const finalReturDetails = useMemo(() => {
    const details = dataReturBarang?.data?.transaction.details ?? [];

    return details
      .filter((item) => returDetailsMap.has(item.id))
      .map((item) => ({
        ...item,
        ...returDetailsMap.get(item.id),
      }));
  }, [dataReturBarang, returDetailsMap]);

  const summary = useMemo(() => {
    return finalReturDetails?.reduce(
      (acc, detail) => {
        // total
        acc.totalBarangRusak += detail.quantityDamaged ?? 0;
        acc.totalBarangBagus += detail.quantityGood ?? 0;
        acc.totalRefund = dataReturBarang?.data?.totalRefundAll ?? 0;

        return acc;
      },
      {
        totalBarangRusak: 0,
        totalBarangBagus: 0,
        totalRefund: 0,
      },
    );
  }, [finalReturDetails]);

  const invalidateReturBarangQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["retur-barang-detail", validatedReturBarangId],
    });

    queryClient.invalidateQueries({
      queryKey: ["notifikasi-global"],
    });

    queryClient.invalidateQueries({
      queryKey: ["notifikasi-pengajuan-retur-barang"],
    });

    queryClient.invalidateQueries({
      queryKey: ["notifikasi-pengajuan-retur-barang"],
    });

    queryClient.invalidateQueries({
      queryKey: ["riwayat-pengajuan-retur-barang", validatedReturBarangId],
    });
  };

  // mutate verifikasi
  const {
    mutateAsync: mutateVerifikasiPengajuanReturBarang,
    isPending: isPendingVerifikasiPengajuanReturBarang,
  } = useMutation({
    mutationFn: (data: {
      kodeReferensi: string;
      keterangan?: string;
      status: Exclude<StatusInventoriType, "DRAFT" | "PENDING">;
    }) => ReturBarangServices.verifikasi(data),
    onSuccess: () => {
      handleSetToast("approved_pengajuan");

      invalidateReturBarangQueries();

      // close modal  konfirmasi
      handleCloseModalKonfirmasiVerifikasi();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Proses setuju pengajuan barang masuk: konfirmasi, lalu verifikasi dengan status POSTED
  const handleSetuju = async () => {
    try {
      if (!dataReturBarang?.data?.kodeReferensi) return;

      const isConfirm = await confirmModalKonfirmasiVerifikasi(
        {
          bigTitle:
            "Apakah Anda yakin ingin menyetujui pengajuan retur barang?",
          smallTitle:
            "Pastikan seluruh data retur barang telah sesuai. Setelah disetujui, data akan diposting dan stok barang akan diperbarui",
        },
        {
          disableCloseAfterSubmit: true,
        },
      );

      if (!isConfirm) {
        return;
      }

      await mutateVerifikasiPengajuanReturBarang({
        kodeReferensi: dataReturBarang?.data?.kodeReferensi,
        status: STATUS_INVENTORI_TYPE.POSTED,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // is can verifikasi
  const isSomeStokNotEnough = useMemo(() => {
    return finalReturDetails.some(
      (item) => item.totalRetur + (item.quantityReturn ?? 0) >= item.quantity,
    );
  }, [finalReturDetails]);

  // handle redirect ubah data
  const handleRedirectUbahData = () => {
    return navigate(`${currentPathname}/ubah-data`);
  };

  return {
    dataReturBarang,
    isLoadingReturBarang,
    handleBack,
    finalReturDetails,
    summary,
    handleShowModalFormulirVerifikasiOrPengajuan,
    handleCloseModalFormulirVerifikasiOrPengajuan,
    dataModalFormulirVerifikasiOrPengajuan,
    modalFormulirVerifikasiOrPengajuan,
    validatedReturBarangId,
    alert,
    handleSetAlert,
    pengguna,
    toast,
    modalKonfirmasiVerifikasiRef,
    handleCancelModalKonfirmasiVerifikasi,
    dataModalKonfirmasiVerifikasi,
    handleKonfirmasiModalKonfirmasiVerifikasi,
    handleSetuju,
    isPendingVerifikasiPengajuanReturBarang,
    isSomeStokNotEnough,
    handleRedirectUbahData,
  };
};

export default useReturBarangDetail;
