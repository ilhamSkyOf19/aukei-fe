import { forwardRef, useImperativeHandle } from "react";
import type { ChildRef } from "../../../../types/ref.type";
import useNotifikasiProduk from "./useNotifikasiProduk";
import CardNotifikasiProduk from "../../../../components/ui/cards/CardNotifikasiProduk";
import DataEmpty from "../../../../components/messages/DataEmpty";
import { BellOff } from "lucide-react";
import LoadingFetch from "../../../../components/ui/LoadingFetch";

type Props = {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
  handleRedirectDetail?: (id: number) => void;
  windowSize?: "sm" | "md" | "lg";
};

const NotifikasiProduk = forwardRef<ChildRef, Props>(
  ({ windowSize, ...props }, ref) => {
    const {
      dataNotifikasiProduk,
      handleRefresh,
      isExistDataNotifikasiProduk,
      isLoadingNotifikasiProduk,
    } = useNotifikasiProduk({ ...props });

    useImperativeHandle(ref, () => ({
      refetchActive: handleRefresh,
    }));

    return (
      <div className="w-full flex flex-col justify-start items-start gap-2.5">
        {isLoadingNotifikasiProduk ? (
          <LoadingFetch />
        ) : isExistDataNotifikasiProduk ? (
          dataNotifikasiProduk?.data?.data.map((item) => (
            <CardNotifikasiProduk
              key={item.id}
              data={item}
              {...(props.handleRedirectDetail && {
                handleRedirectProdukDetail: (id: number) =>
                  props.handleRedirectDetail?.(id),
              })}
              large
              windowSize={windowSize}
            />
          ))
        ) : (
          <div className="w-full flex flex-row justify-center items-center">
            <DataEmpty
              iconData={BellOff}
              title="Tidak Ada Notifikasi Produk"
              description="Belum ada data notifikasi produk yang dapat ditampilkan saat ini, silahkan coba tekan tombol refresh"
              xs
            />
          </div>
        )}
      </div>
    );
  },
);

export default NotifikasiProduk;
