import { forwardRef, useImperativeHandle } from "react";
import type { ChildRef } from "../../../../types/ref.type";
import DataEmpty from "../../../../components/messages/DataEmpty";
import { BellOff } from "lucide-react";
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import useNotifikasiPengajuanStockOpname from "./useNotifikasiPengajuanStokOpname";
import CardNotifikasiStockOpname from "../../../../components/ui/cards/CardNotifikasiPengajuanStockOpname";

type Props = {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
  handleRedirectDetail: (id: number) => void;
  windowSize?: "sm" | "md" | "lg";
};

const NotifikasiPengajuanStockOpname = forwardRef<ChildRef, Props>(
  ({ windowSize, handleRedirectDetail, ...props }, ref) => {
    const {
      dataNotifikasiStockOpname,
      handleRefresh,
      isExistDataNotifikasiStockOpname,
      isLoadingNotifikasiStockOpname,
    } = useNotifikasiPengajuanStockOpname({ ...props });

    useImperativeHandle(ref, () => ({
      refetchActive: handleRefresh,
    }));

    return (
      <div className="w-full flex flex-col justify-start items-start gap-2.5">
        {isLoadingNotifikasiStockOpname ? (
          <LoadingFetch />
        ) : isExistDataNotifikasiStockOpname ? (
          dataNotifikasiStockOpname?.data?.data.map((item) => (
            <CardNotifikasiStockOpname
              key={item.id}
              data={item}
              handleRedirectDetail={handleRedirectDetail}
              large
              windowSize={windowSize}
            />
          ))
        ) : (
          <div className="w-full flex flex-row justify-center items-center">
            <DataEmpty
              iconData={BellOff}
              title="Tidak Ada Notifikasi Pengajuan Barang"
              description="Belum ada data notifikasi pengajuan barang yang dapat ditampilkan saat ini, silahkan coba tekan tombol refresh"
              xs
            />
          </div>
        )}
      </div>
    );
  },
);

export default NotifikasiPengajuanStockOpname;
