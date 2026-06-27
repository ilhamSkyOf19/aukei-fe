import { ArrowLeft, ArrowRight } from "lucide-react";
import FilterKategori from "../../../../components/filters/Kategori";
import InputSearch from "../../../../components/inputs/InputSearch";
import useShowProduk from "./useShowProduk";
import { formatRupiah } from "../../../../helpers/helpers";
import type { DetailsForCreate } from "../../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";
import type { FC } from "react";

// props
type Props = {
  pelangganId?: number;
  handleAppend: (
    produk: Pick<DetailsForCreate, "hargaJual" | "produkId" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id">,
  ) => void;
};

const ShowProduk: FC<Props> = ({ handleAppend, pelangganId }) => {
  // call use
  const {
    dataProduk,
    handleKategori,
    handlePage,
    isLoadingProduk,
    setSearch,
    isExistDataProduk,
  } = useShowProduk({ pelangganId });

  return (
    <div className="flex-1 flex flex-col justify-start items-center">
      {/* header */}
      <div className="w-full flex flex-row justify-between items-start">
        {/* search */}
        <div className="flex-1">
          <InputSearch handleSearch={setSearch} />
        </div>

        <div className="flex-1 flex flex-row justify-end items-start flex-wrap">
          {/* filter kategori */}
          <FilterKategori setKategori={handleKategori} customWidth="w-30" />
        </div>
      </div>

      {/* daftar produk */}
      <div className="grid grid-cols-4 lg:gap-2 xl:gap-4">
        {/* card */}
        {isExistDataProduk ? (
          dataProduk?.data?.data.map((item) => (
            <button
              type="button"
              key={item.id}
              className="col-span-1 lg:h-50 xl:h-60 flex flex-row justify-start items-start p-1.5 group"
              onClick={() =>
                handleAppend({
                  hargaJual: item.hargaJual,
                  produkId: item.id,
                  quantity: 1,
                  img: item.img,
                  kode: item.kode,
                  nama: item.nama,
                  stok: item.stok,
                  hargaJualTerakhirTransaksi: item.hargaJualTerakhirTransaksi,
                })
              }
            >
              <div className="w-full h-full flex flex-col justify-start items-start rounded-md shadow-sm overflow-hidden gap-2 group-hover:shadow-custom-primary group-hover:shadow-sm transition-all duration-300 ease-in-out group-hover:scale-102">
                <div className="w-full flex-4 flex flex-row justify-center items-center overflow-hidden">
                  <img
                    src={item.img}
                    alt="wall panel"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full flex-3 flex flex-col justify-start items-start px-2 gap-2.5">
                  {/* name */}
                  <div className="w-full flex flex-col justify-start items-start gap-0.5">
                    <p className="text-xs font-medium text-base-content">
                      {item.nama}
                    </p>
                    {/* kode */}
                    <p className="text-xs font-medium text-base-content/50">
                      {item.kode}
                    </p>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-2">
                    {/* harga */}
                    <p className="text-xs font-semibold text-base-content">
                      {formatRupiah(item.hargaJual)}
                    </p>

                    {/* stok */}
                    <p className="text-[0.625rem] font-medium text-base-content/80">
                      Stok: <span className="ml-px">{item.stok}</span>
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div></div>
        )}
      </div>

      {/* prev and next */}
      <div className="w-full flex flex-row justify-between items-start py-4 px-1">
        {/* button prev */}
        <button
          type="button"
          className="flex flex-row justify-start items-center gap-2 border border-base-content/10 rounded-md py-2 px-3 hover-overlay"
          onClick={() => handlePage("prev")}
        >
          <ArrowLeft className="size-4 text-base-content" />
          <span className="text-xs font-semibold text-base-content">
            Sebelumnya
          </span>
        </button>
        {/* button prev */}
        <button
          type="button"
          className="flex flex-row justify-start items-center gap-2 border border-base-content/10 rounded-md py-2 px-3 hover-overlay"
          onClick={() => handlePage("next")}
        >
          <span className="text-xs font-semibold text-base-content">
            Selanjutnya
          </span>
          <ArrowRight className="size-4 text-base-content" />
        </button>
      </div>
    </div>
  );
};

export default ShowProduk;
