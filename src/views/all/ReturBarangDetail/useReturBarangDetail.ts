import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { ReturBarangServices } from "../../../services/returBarang.service";
import { useMemo } from "react";
import useModal from "../../../hooks/useModal";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useAuthStore } from "../../../stores/authStore";
import { useToastAnimation } from "../../../hooks/useToast";

const useReturBarangDetail = () => {
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const { toast, handleSetToast } = useToastAnimation();

  // handle back
  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -2).join("/"));
  };

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
  };
};

export default useReturBarangDetail;
