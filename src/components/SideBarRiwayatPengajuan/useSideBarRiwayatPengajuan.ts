import { useLocation, useParams } from "react-router-dom";
import { parseId } from "../../helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { PengajuanBarangMasukServices } from "../../services/pengajuanBarangMasuk.service";
import { useFilter } from "../../hooks/useFilter";
import { PengajuanBarangKeluarServices } from "../../services/pengajuanBarangkeluar.service";

const useSideBarRiwayatPengajuan = () => {
  // get validated
  const { id } = useParams<{ id: string }>();
  // parse id
  const validatedId = parseId(id);

  // get current pathname
  const currentPathname = useLocation().pathname;

  // is barang masuk
  const isBarangMasuk = currentPathname.includes("barang-masuk");

  // is barang kelaur
  const isBarangKeluar = currentPathname.includes("barang-keluar");

  //   filter page
  const { filter: page, setFilter: setPage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // query
  const { data: dataRiwayat, isLoading: isLoadingRiwayat } = useQuery({
    queryKey: [
      isBarangMasuk
        ? "riwayat-pengajuan-barang-masuk"
        : "riwayat-pengajuan-barang-keluar",
      validatedId,
      isBarangMasuk,
      isBarangKeluar,
      { page },
    ],
    queryFn: () => {
      if (validatedId) {
        if (isBarangMasuk) {
          return PengajuanBarangMasukServices.riwayatPengajuan({
            barangMasukId: validatedId,
            ...(page && { page }),
          });
        } else {
          return PengajuanBarangKeluarServices.riwayatPengajuan({
            barangKeluarId: validatedId,
            ...(page && { page }),
          });
        }
      } else {
        return;
      }
    },
    enabled: !!validatedId && (!!isBarangKeluar || !!isBarangMasuk),
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

    isBarangMasuk,
  };
};

export default useSideBarRiwayatPengajuan;
