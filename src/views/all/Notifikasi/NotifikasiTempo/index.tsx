import { forwardRef, useImperativeHandle } from "react";
import type { ChildRef } from "../../../../types/ref.type";
import CardNotifikasiTempo from "../../../../components/ui/cards/CardNotifikasiTempo";
import useNotifikasiTempo from "./useNotifikasiTempo";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import DataEmpty from "../../../../components/messages/DataEmpty";
import { BellOff } from "lucide-react";

type Props = {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
  setPage: (value: string) => void;
  setLimit: (value: string) => void;
  handleRedirectDetail: (params: {
    pelangganId: number;
    tempoId: number;
  }) => void;
};

const NotifikasiTempo = forwardRef<ChildRef, Props>(
  ({ setLimit, setPage, ...props }, ref) => {
    const { dataNotifikasiTempo, handleRefresh, isExistDataNotifikasiTempo } =
      useNotifikasiTempo({ ...props });

    useImperativeHandle(ref, () => ({
      refetchActive: handleRefresh,
    }));

    return (
      <>
        <div className="w-full flex flex-col justify-start items-start gap-2.5">
          {isExistDataNotifikasiTempo ? (
            dataNotifikasiTempo?.data?.data.map((item, index) => (
              <CardNotifikasiTempo
                key={index}
                data={item}
                handleRedirectTempoDetail={(params: {
                  pelangganId: number;
                  tempoId: number;
                }) =>
                  props.handleRedirectDetail({
                    pelangganId: params.pelangganId,
                    tempoId: params.tempoId,
                  })
                }
                large
              />
            ))
          ) : (
            <div className="w-full flex flex-row justify-center items-center">
              <DataEmpty
                iconData={BellOff}
                title="Tidak Ada Notifikasi Jatuh Tempo"
                description="Belum ada data notifikasi jatuh tempo yang dapat ditampilkan saat ini, silahkan coba tekan tombol refresh"
                xs
              />
            </div>
          )}
        </div>

        {/* pagination */}
        <PaginationAndLimit
          currentPage={Number(dataNotifikasiTempo?.data?.meta?.currentPage)}
          setPage={setPage}
          totalPage={dataNotifikasiTempo?.data?.meta?.totalPage ?? 0}
          emptyData={!isExistDataNotifikasiTempo}
          limit={dataNotifikasiTempo?.data?.meta?.limit}
          setLimit={setLimit}
        />
      </>
    );
  },
);

export default NotifikasiTempo;
