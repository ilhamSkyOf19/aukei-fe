import { useParams } from "react-router-dom";
import { parseId } from "../../helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { useFilter } from "../../hooks/useFilter";
import { PengajuanStockOpnameServices } from "../../services/pengajuanStockOpname.service";

const useSideBarRiwayatPengajuanStockOpname = () => {
  // get validated
  const { id } = useParams<{ id: string }>();
  // parse id
  const validatedId = parseId(id);

  //   filter page
  const { filter: page, setFilter: setPage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // query
  const { data: dataRiwayat, isLoading: isLoadingRiwayat } = useQuery({
    queryKey: ["riwayat-pengajuan-stock-opname", validatedId, { page }],
    queryFn: () =>
      PengajuanStockOpnameServices.riwayatPengajuan({
        stockOpnameId: validatedId!,
        ...(page && { page }),
      }),
    enabled: !!validatedId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing data
  const isExistDataRiwayat: boolean =
    !isLoadingRiwayat && dataRiwayat?.data?.data
      ? dataRiwayat?.data?.data?.length > 0
        ? true
        : false
      : false;

  return {
    dataRiwayat,
    isLoadingRiwayat,
    isExistDataRiwayat,
    setPage,
  };
};

export default useSideBarRiwayatPengajuanStockOpname;
