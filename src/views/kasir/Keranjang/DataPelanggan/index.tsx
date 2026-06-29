import type { FC } from "react";
import InputSearch from "../../../../components/inputs/InputSearch";
import Avatar from "../../../../components/ui/Avatar";
import { cn } from "../../../../utils/cn";
import useDataPelanggan from "./useDataPelanggan";
import { formatNumberPhone } from "../../../../helpers/helpers";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";

const DataPelanggan = () => {
  // use call
  const {
    isChoosePelanggan,
    dataPelanggan,
    handleSearch,
    isLoadingPelanggan,
    isExistDataProduk,
    handleSetIsChoosePelanggan,
    handlePage,
  } = useDataPelanggan();

  return (
    <div className="w-full rounded-lg h-90 bg-base-100 shadow-sm p-4">
      {/* header */}
      <div className="w-full flex flex-col justify-start items-start gap-2">
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
      <div className="w-full flex flex-col justify-start items-start mt-2">
        {/* card */}
        {isLoadingPelanggan ? (
          <div></div>
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
            />
          ))
        ) : (
          <div></div>
        )}
      </div>
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
};
const CardPelanggan: FC<CardPelangganProps> = ({
  nama,
  updatedAt,
  index,
  handleChoose,
  id,
  isChoose,
}) => {
  return (
    <div
      className={cn(
        "w-full border-b",
        isChoose ? "border-transparent" : "border-base-content/10",
      )}
    >
      <button
        type="button"
        className={cn(
          "w-full flex flex-row justify-between items-center border border-transparent rounded-lg py-2.5 px-2  transition-all duration-150 ease-in-out",
          isChoose
            ? "border-emerald-600 bg-emerald-600/5"
            : "hover:border-emerald-600 hover:bg-emerald-600/5",
        )}
        disabled={isChoose}
        onClick={() => handleChoose(id)}
      >
        <div className="flex-2 flex flex-row justify-start items-center gap-4">
          {/* avatar */}
          <Avatar index={index} nama="John Doe" xs />

          <div className="flex flex-col justify-start items-start gap-0.5">
            <span className="text-sm font-semibold text-base-content">
              {nama}
            </span>
            <span className="text-[0.625rem] text-base-content/50 font-medium">
              Diupdate: {formatTanggalLengkap(updatedAt)}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-row justify-end items-center">
          <span className="text-[0.625rem] font-medium py-1 px-2 rounded-full bg-emerald-50 text-emerald-600">
            3 item
          </span>
        </div>
      </button>
    </div>
  );
};

export default DataPelanggan;
