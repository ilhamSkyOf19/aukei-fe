import { useParams } from "react-router-dom";
import { parseId } from "../../helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { useFilter } from "../../hooks/useFilter";
import { RiwayatPengajuanReturBarangService } from "../../services/riwayatPengajuanReturBarang.service";

const useSideBarRiwayatPengajuan = () => {
  // get validated
  const { returBarangId } = useParams<{ returBarangId: string }>();
  // parse id
  const validatedId = parseId(returBarangId);

  //   filter page
  const { filter: page, setFilter: setPage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // query
  const {
    data: dataRiwayatReturBarang,
    isLoading: isLoadingRiwayatReturBarang,
  } = useQuery({
    queryKey: [validatedId, page],
    queryFn: () =>
      RiwayatPengajuanReturBarangService.findAllByReturBarang({
        id: validatedId!,
      }),
    enabled: !!validatedId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing data
  const isExistDataRiwayat: boolean =
    !isLoadingRiwayatReturBarang && dataRiwayatReturBarang?.data?.data
      ? dataRiwayatReturBarang?.data?.data?.length > 0
        ? true
        : false
      : false;

  return {
    isExistDataRiwayat,
    setPage,
    dataRiwayatReturBarang,
    isLoadingRiwayatReturBarang,
  };
};

export default useSideBarRiwayatPengajuan;
