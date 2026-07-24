import { useParams } from "react-router-dom";
import { parseId } from "../../helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { TempoService } from "../../services/tempo.service";
import { useState } from "react";

const useSideBarRiwayatPembayaranTempo = () => {
  // get validated
  const { tempoId } = useParams<{ tempoId: string }>();
  // parse id
  const validatedId = parseId(tempoId);

  const [cicilanKe, setCicilanKe] = useState<number | "dp">("dp");

  const [page, setPage] = useState<string>("1");

  const handleSetCicilanKe = (cicilanKe: number | "dp") => {
    setCicilanKe(cicilanKe);
    setPage("1");
  };

  // query
  const { data: dataRiwayat, isLoading: isLoadingRiwayat } = useQuery({
    queryKey: ["riwayat-payment-tempo", validatedId, { page, cicilanKe }],
    queryFn: () =>
      TempoService.historyPaymentTempo({
        tempoId: validatedId!,
        query: {
          ...(cicilanKe && { cicilanKe: cicilanKe.toString() }),
          ...(page && { page }),
        },
      }),
    enabled: !!validatedId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing data
  const isExistDataPayment: boolean =
    !isLoadingRiwayat && dataRiwayat?.data?.data
      ? dataRiwayat?.data?.data?.payments?.length > 0
        ? true
        : false
      : false;

  return {
    dataRiwayat,
    isLoadingRiwayat,
    setPage,
    handleSetCicilanKe,
    cicilanKe,
    isExistDataPayment,
  };
};

export default useSideBarRiwayatPembayaranTempo;
