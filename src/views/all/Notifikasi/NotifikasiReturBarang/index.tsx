import { forwardRef, useImperativeHandle } from "react";
import type { ChildRef } from "../../../../types/ref.type";
import DataEmpty from "../../../../components/messages/DataEmpty";
import { BellOff } from "lucide-react";
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import useNotifikasiReturBarang from "./useNotifikasiReturBarang";
import CardNotifikasiPengajuanReturBarang from "../../../../components/ui/cards/CardNotifikasiPengajuanReturBarang";

type Props = {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
  handleRedirectReturBarangDetail: (params: {
    pelangganId?: number;
    transactionId?: number;
    returBarangId?: number;
  }) => void;
  windowSize?: "sm" | "md" | "lg";
};

const NotifikasiReturBarang = forwardRef<ChildRef, Props>(
  ({ windowSize, ...props }, ref) => {
    const {
      dataNotifikasiReturBarang,
      handleRefresh,
      isExistDataNotifikasiReturBarang,
      isLoadingNotifikasiReturBarang,
    } = useNotifikasiReturBarang({ ...props });

    useImperativeHandle(ref, () => ({
      refetchActive: handleRefresh,
    }));

    return (
      <div className="w-full flex flex-col justify-start items-start gap-2.5">
        {isLoadingNotifikasiReturBarang ? (
          <LoadingFetch />
        ) : isExistDataNotifikasiReturBarang ? (
          dataNotifikasiReturBarang?.data?.data.map((item) => (
            <CardNotifikasiPengajuanReturBarang
              key={item.id}
              data={item}
              handleRedirectPengajuanReturBarangDetail={
                props.handleRedirectReturBarangDetail
              }
              large
              windowSize={windowSize}
            />
          ))
        ) : (
          <div className="w-full flex flex-row justify-center items-center">
            <DataEmpty
              iconData={BellOff}
              title="Tidak Ada Notifikasi Pengajuan Retur Barang"
              description="Belum ada data notifikasi pengajuan retur barang yang dapat ditampilkan saat ini, silahkan coba tekan tombol refresh"
              xs
            />
          </div>
        )}
      </div>
    );
  },
);

export default NotifikasiReturBarang;
