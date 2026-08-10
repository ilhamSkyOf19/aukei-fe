import type { FC } from "react";
import InputSearch from "../../../../components/inputs/InputSearch";
import Avatar from "../../../../components/ui/Avatar";
import { cn } from "../../../../utils/cn";
import useDataPelanggan from "./useDataPelanggan";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import Pagination from "../../../../components/ui/Pagination";
import DataEmpty from "../../../../components/messages/DataEmpty";
import { UserRoundX } from "lucide-react";
import { formatNumber } from "../../../../helpers/helpers";

const DataPelanggan = () => {
  // use call
  const {
    isChoosePelanggan,
    dataPelanggan,
    handleSearch,
    isLoadingPelanggan,
    isExistDataProduk,
    handleSetIsChoosePelanggan,
    goTo,
    isNext,
    isPrev,
    pages,
  } = useDataPelanggan();

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2.5  rounded-xl bg-base-100 shadow-sm p-4 border border-transparent dark:border-base-content/10">
      {/* header */}
      <div className="w-full flex-1 flex flex-col justify-start items-start gap-2">
        {/* title */}
        <h3 className="text-base-content text-sm font-semibold">
          Pilih Pelanggan
        </h3>

        {/* input search */}
        <div className="w-full flex flex-row justify-start items-center gap-2">
          <InputSearch handleSearch={handleSearch} />
        </div>
      </div>

      {/* daftar pelanggan */}
      <div className="w-full flex-10 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-custom-secondary justify-start items-start">
        {/* card */}
        {isLoadingPelanggan ? (
          Array.from({ length: 8 }, (_, i) => i).map((item) => (
            <div key={item} className="w-full h-12 skeleton my-1" />
          ))
        ) : isExistDataProduk ? (
          dataPelanggan?.data?.data?.map((item, index) => (
            <CardPelanggan
              key={item.id}
              id={item.id}
              isChoose={isChoosePelanggan === item.id}
              handleChoose={handleSetIsChoosePelanggan}
              index={index}
              nama={item.nama}
              updatedAt={item.updatedAtCart}
              totalItem={item.totalItem}
            />
          ))
        ) : (
          <div className="w-full flex flex-col justify-center items-center h-100">
            <DataEmpty
              title="Data Pelanggan Tidak Tersedia"
              description="Belum ada data pelanggan yang dapat ditampilkan untuk saat ini"
              xs
              iconData={UserRoundX}
            />
          </div>
        )}
      </div>

      {dataPelanggan?.data && dataPelanggan?.data?.meta?.totalPage > 1 && (
        <div className="w-full flex-1 flex flex-row justify-center items-center">
          {/* buat pagination pelanggan */}
          <Pagination
            currentPage={dataPelanggan?.data?.meta?.currentPage || 1}
            goTo={goTo}
            isNext={isNext}
            isPrev={isPrev}
            pages={pages}
            xs
          />
        </div>
      )}
    </div>
  );
};

// card pelanggan
type CardPelangganProps = {
  id: number;
  nama: string;
  updatedAt: Date;
  index: number;
  isChoose: boolean;
  handleChoose: (value: number) => void;
  totalItem: number;
};
const CardPelanggan: FC<CardPelangganProps> = ({
  nama,
  updatedAt,
  index,
  handleChoose,
  id,
  isChoose,
  totalItem,
}) => {
  return (
    <div
      className={cn(
        "w-full border-b shrink-0 ",
        isChoose ? "border-transparent" : "border-base-content/10",
      )}
    >
      <button
        type="button"
        className={cn(
          "w-full flex flex-row justify-between items-center border border-transparent rounded-xl py-2.5 px-2  transition-all duration-150 ease-in-out",
          isChoose
            ? "border-emerald-600 bg-emerald-600/5"
            : "hover:border-emerald-600 hover:bg-emerald-600/5",
        )}
        disabled={isChoose}
        onClick={() => handleChoose(id)}
      >
        <div className="flex-4 flex flex-row justify-start items-center gap-4">
          {/* avatar */}
          <Avatar index={index} nama={nama} xs />

          <div className="flex flex-col justify-start items-start gap-0.5">
            <span className="lg:text-xs xl:text-sm font-semibold text-base-content">
              {nama}
            </span>
            <span className="text-[0.625rem] text-left text-base-content/50 font-medium">
              Diupdate: {formatTanggalLengkap(updatedAt)}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-row justify-end items-center">
          <span className="text-[0.625rem] font-medium py-1 px-2 rounded-full bg-emerald-50 text-emerald-600">
            {formatNumber(totalItem)} item
          </span>
        </div>
      </button>
    </div>
  );
};

export default DataPelanggan;
