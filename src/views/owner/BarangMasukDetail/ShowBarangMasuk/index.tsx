import { Ellipsis } from "lucide-react";
import { formatRupiah } from "../../../../helpers/helpers";
import DataEmpty from "../../../../components/messages/DataEmpty";
import type { ResponseStructure } from "../../../../types/response.type";
import type { ResponseBarangMasukWithDetailType } from "../../../../models/barangMasuk.model";
import type { FC } from "react";

type Props = {
  isLoadingBarangMasukDetail?: boolean;
  dataBarangMasukDetail?: ResponseStructure<ResponseBarangMasukWithDetailType | null>;
};
const ShowDataBarangMasuk: FC<Props> = ({
  dataBarangMasukDetail,
  isLoadingBarangMasukDetail,
}) => {
  return (
    <div className="w-full card dark:border dark:border-base-content/10 flex flex-col justify-start items-center mt-2 gap-3">
      {/* data empty */}
      {isLoadingBarangMasukDetail ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-20 skeleton shadow-xs border border-base-content/10"
          />
        ))
      ) : dataBarangMasukDetail?.data &&
        dataBarangMasukDetail?.data?.detailBarangMasuks?.length > 0 ? (
        dataBarangMasukDetail?.data?.detailBarangMasuks?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col py-2.5 px-3 justify-start items-start w-full card bg-base-100 shadow-xs min-h-20"
          >
            {/* content one */}
            <div className="w-full h-full flex flex-row justify-start items-start gap-3">
              {/* img */}
              <div className="flex-1 flex flex-row justify-start items-center">
                <div className="w-18 h-18 overflow-hidden bg-black rounded-md">
                  <img
                    src={item.produk.img}
                    alt="foto produk"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start items-center w-full">
                {/* nama */}
                <div className="w-full flex flex-row justify-between items-start">
                  <div className="w-full flex flex-col justify-start items-start gap-1">
                    <p className="text-base-content text-sm font-semibold">
                      {item.produk.nama}
                    </p>
                    <p className="text-base-content/50 text-[0.7rem] font-medium">
                      {item.produk.kode}
                    </p>
                  </div>

                  {/* button aksi */}
                  <div className="flex flex-row justify-end items-start">
                    <button type="button" className="p-px">
                      <Ellipsis className="size-4" />
                    </button>
                  </div>
                </div>

                {/* data */}
                <div className="w-full flex flex-row justify-start items-end mt-2 flex-wrap gap-2">
                  {/* harga beli */}
                  <div className="w-30 flex flex-col justify-start items-start">
                    <span className="text-[0.7rem] font-medium text-base-content/50">
                      Harga Beli
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiah(item.produk.hargaBeli)}
                    </span>
                  </div>
                  {/* box */}
                  <div className="w-12 flex flex-col justify-start items-start">
                    <span className="text-[0.7rem] font-medium text-base-content/50">
                      Box
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {item.jumlahBox}
                    </span>
                  </div>
                  {/* isi */}
                  <div className="w-12 flex flex-col justify-start items-start">
                    <span className="text-[0.7rem] font-medium text-base-content/50">
                      Isi
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {item.produk.isiPerBox}
                    </span>
                  </div>
                  {/* total */}
                  <div className="w-30 flex flex-col justify-start items-start">
                    <span className="text-[0.7rem] font-medium text-base-content/50">
                      Total
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {formatRupiah(
                        item.produk.isiPerBox *
                          item.jumlahBox *
                          item.produk.hargaBeli,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <DataEmpty
          title="Data Barang Masuk Tidak Tersedia"
          description="Belum ada data barang masuk yang dapat ditampilkan saat ini"
        />
      )}
    </div>
  );
};

export default ShowDataBarangMasuk;
