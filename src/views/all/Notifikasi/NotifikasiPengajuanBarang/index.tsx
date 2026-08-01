import { forwardRef, useImperativeHandle } from "react";
import type { ChildRef } from "../../../../types/ref.type";
import useNotifikasiPengajuanBarang from "./useNotifikasiPengajuanBarang";
import CardNotifikasiPengajuanBarang from "../../../../components/ui/cards/CardNotifikasiPengajuanBarang";
import DataEmpty from "../../../../components/messages/DataEmpty";
import { BellOff } from "lucide-react";

type Props = {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
  handleRedirectPengajuanBarangDetail: (params: {
    barangMasukId?: number;
    barangKeluarId?: number;
  }) => void;
};

const NotifikasiPengajuanBarang = forwardRef<ChildRef, Props>((props, ref) => {
  const {
    dataNotifikasiPengajuanBarang,
    handleRefresh,
    isExistDataNotifikasiPengajuanBarang,
  } = useNotifikasiPengajuanBarang({ ...props });

  useImperativeHandle(ref, () => ({
    refetchActive: handleRefresh,
  }));

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2.5">
      {isExistDataNotifikasiPengajuanBarang ? (
        dataNotifikasiPengajuanBarang?.data?.data.map((item) => (
          <CardNotifikasiPengajuanBarang
            key={item.id}
            data={item}
            handleRedirectPengajuanBarangDetail={(params: {
              barangMasukId?: number;
              barangKeluarId?: number;
            }) =>
              props.handleRedirectPengajuanBarangDetail({
                barangMasukId: params.barangMasukId,
                barangKeluarId: params.barangKeluarId,
              })
            }
            large
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
});

export default NotifikasiPengajuanBarang;
