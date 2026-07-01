import { ArrowLeft, ArrowRight } from "lucide-react";
import FilterKategori from "../../../../../components/filters/Kategori";
import InputSearch from "../../../../../components/inputs/InputSearch";
import useShowProduk from "./useShowProduk";
import { formatRupiah } from "../../../../../helpers/helpers";
import type { DetailsForCreate } from "../../../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../../../models/produk.model";
import { type FC } from "react";
import DataEmpty from "../../../../../components/messages/DataEmpty";

// props
type Props = {
  pelangganId?: number;
  handleShowModalFormulirTransaksi: (
    produk: Pick<DetailsForCreate, "hargaJual" | "produkId" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id"> & { diskon?: number },
  ) => void;
  step: number;
  onAppendMany: (
    produkList: (Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id"> & {
        diskon?: number;
      })[],
  ) => void;
};

const ShowProduk: FC<Props> = ({
  pelangganId,
  step,
  onAppendMany,
  handleShowModalFormulirTransaksi,
}) => {
  // call use
  const {
    dataProduk,
    handleKategori,
    handlePage,
    isLoadingProduk,
    setSearch,
    isExistDataProduk,
  } = useShowProduk({ pelangganId, step, onAppendMany });

  return (
    <div className="flex-1 flex flex-col justify-start items-center gap-3">
      {/* header */}
      <div className="w-full flex flex-row justify-between items-start border border-custom-border p-3 bg-custom-surface shadow-sm rounded-lg">
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
      <div className="grid grid-cols-3 gap-2">
        {/* card */}
        {isLoadingProduk ? (
          Array.from({ length: 8 }, (_, i) => i).map((item) => (
            <div key={item} className="col-span-1 lg:h-50 xl:h-55 p-1.5">
              <div className=" skeleton w-40 h-full" />
            </div>
          ))
        ) : isExistDataProduk ? (
          dataProduk?.data?.data.map((item, index) => (
            <button
              type="button"
              key={index}
              className="col-span-1 lg:h-50 xl:h-60 flex flex-row justify-start items-start p-1.5 group"
              onClick={() =>
                handleShowModalFormulirTransaksi({
                  produkId: item.id,
                  nama: item.nama,
                  img: item.img,
                  hargaJual: item.hargaJual,
                  kode: item.kode,
                  hargaJualTerakhirTransaksi: item.hargaJualTerakhirTransaksi,
                  diskon: 0,
                  quantity: 1,
                  stok: item.stok,
                })
              }
            >
              <div className="w-full h-full flex flex-col justify-start items-start rounded-lg shadow-sm overflow-hidden gap-2 group-hover:shadow-custom-primary group-hover:shadow-sm transition-all duration-300 ease-in-out group-hover:scale-102 bg-base-100 p-3">
                <div className="w-full flex-2 rounded-lg flex flex-row justify-center items-center overflow-hidden">
                  <img
                    src={item.img}
                    alt="wall panel"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full flex-1 flex flex-col justify-start items-start px-2 gap-2.5 ">
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
                  <div className="w-full flex flex-row justify-between items-start gap-2">
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
          <div className="col-span-4 flex-row justify-center items-center">
            <DataEmpty
              title="Data Produk Tidak Tersedia"
              description="Belum ada data produk yang dapat ditampilkan saat ini"
              xs
            />
          </div>
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
