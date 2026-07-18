import { ArrowLeft, ArrowRight } from "lucide-react";
import FilterKategori from "../../../../../components/filters/Kategori";
import InputSearch from "../../../../../components/inputs/InputSearch";
import useShowProduk from "./useShowProduk";
import {
  formatRupiah,
  formatRupiahShort,
} from "../../../../../helpers/helpers";
import type { DetailsForCreate } from "../../../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../../../models/produk.model";
import { type FC } from "react";
import DataEmpty from "../../../../../components/messages/DataEmpty";
import Pagination from "../../../../../components/ui/Pagination";
import { cn } from "../../../../../utils/cn";

// props
type Props = {
  pelangganId?: number;
  handleShowModalFormulirTransaksi: (
    produk: Pick<DetailsForCreate, "hargaJual" | "produkId" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id"> & { diskon?: number },
  ) => void;
  step: number;
  onAppendMany: (
    produkList: (Pick<
      ResponseProdukForKasirType,
      | "nama"
      | "img"
      | "hargaJual"
      | "kode"
      | "hargaJualTerakhirTransaksi"
      | "id"
      | "stok"
    > & { subTotal: number; diskon: number; quantity: number })[],
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
    goTo,
    isNext,
    isPrev,
    pages,
    kategori,
  } = useShowProduk({ pelangganId, step, onAppendMany });

  return (
    <div className="flex-3 h-full grid grid-rows-2">
      <div className="flex row-span-2 flex-col justify-start text-start gap-2">
        {/* header */}
        <div className="w-full flex flex-row justify-between items-start border border-transparent dark:border-base-content/10 p-2.5 bg-base-100 shadow-sm rounded-xl gap-2.5">
          {/* search */}
          <div className="flex-3">
            <InputSearch handleSearch={setSearch} placeholder="Cari produk" />
          </div>

          <div className="flex-1 flex flex-row justify-end items-start flex-wrap">
            {/* filter kategori */}
            <FilterKategori
              setKategori={handleKategori}
              customWidth="w-50"
              noLabel
              withIcon
              value={kategori}
            />
          </div>
        </div>

        {/* daftar produk */}
        <div
          className={cn(
            "grid w-full grid-cols-5 h-full gap-2 overflow-y-auto scrollbar-thumb-custom-secondary pb-2.5",
          )}
        >
          {/* card */}
          {isLoadingProduk ? (
            Array.from({ length: 10 }, (_, i) => i).map((item) => (
              <div key={item} className="col-span-1 h-48">
                <div className=" skeleton w-full h-full border border-base-content/10" />
              </div>
            ))
          ) : isExistDataProduk ? (
            dataProduk?.data?.data.map((item, index) => (
              <button
                type="button"
                key={index}
                className="col-span-1 h-48 flex flex-row justify-start items-start group"
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
                <div className="w-full h-full flex flex-col justify-start items-start border border-transparent dark:border-base-content/10 rounded-xl shadow-sm overflow-hidden gap-2 group-hover:border-custom-secondary group-hover:shadow-sm transition-all duration-300 ease-in-out bg-base-100 p-1.5">
                  <div className="w-full h-120 shadow-md rounded-xl flex flex-row justify-center items-center overflow-hidden">
                    <img
                      src={item.img}
                      alt="wall panel"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="w-full h-80 flex flex-col justify-start items-start gap-3">
                    {/* name */}
                    <div className="w-full flex flex-col justify-start items-start gap-0.5">
                      <p className="text-xs text-start font-medium text-base-content">
                        {`${item.nama}`.length > 30
                          ? item.nama.slice(0, 30) + "..."
                          : item.nama}{" "}
                      </p>
                      {/* kode */}
                      <p className="text-[0.625rem] font-semibold text-base-content/80">
                        {item.kode}
                      </p>
                    </div>
                    <div className="w-full flex flex-row justify-between items-start gap-0.5">
                      {/* harga */}
                      <p className="text-xs font-semibold text-base-content">
                        {item.hargaJual > 1500000
                          ? formatRupiahShort(item.hargaJual)
                          : formatRupiah(item.hargaJual)}
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
            <div className="col-span-5 h-90">
              <div className="w-full flex flex-row justify-center items-center">
                <DataEmpty
                  title="Data Produk Tidak Tersedia"
                  description="Belum ada data produk yang dapat ditampilkan saat ini"
                  xs
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* prev and next */}
      <div className="w-full row-span-1 flex flex-row justify-between items-center h-12 p-1.5 border border-transparent dark:border-base-content/10 bg-base-100 rounded-xl">
        {/* button prev */}
        <button
          type="button"
          disabled={dataProduk?.data?.meta?.currentPage === 1}
          className={cn(
            "flex flex-row justify-start items-center gap-2 border border-base-content rounded-xl h-full px-3",
            dataProduk?.data?.meta?.currentPage === 1
              ? "opacity-50"
              : " hover:shadow-sm hover:shadow-custom-primary hover:border-custom-primary hover:scale-102 transition-all duration-150 ease-in-out origin-center",
          )}
          onClick={() => handlePage("prev")}
        >
          <ArrowLeft className="xl:size-3 text-base-content" />
          <span className="xl:text-[0.625rem] font-semibold text-base-content">
            Sebelumnya
          </span>
        </button>

        {/* pagination */}
        <Pagination
          currentPage={dataProduk?.data?.meta?.currentPage ?? 1}
          goTo={goTo}
          isNext={isNext}
          isPrev={isPrev}
          pages={pages}
          xs
        />

        {/* button prev */}
        <button
          type="button"
          disabled={
            dataProduk?.data?.meta?.currentPage ===
            dataProduk?.data?.meta?.totalPage
          }
          className={cn(
            "flex flex-row justify-start items-center gap-2 border border-base-content rounded-xl h-full px-3",
            dataProduk?.data?.meta?.currentPage ===
              dataProduk?.data?.meta?.totalPage
              ? "opacity-50"
              : " hover:shadow-sm hover:shadow-custom-primary hover:border-custom-primary hover:scale-102 transition-all duration-150 ease-in-out origin-center",
          )}
          onClick={() => handlePage("next")}
        >
          <span className="xl:text-[0.625rem] font-semibold text-base-content">
            Selanjutnya
          </span>
          <ArrowRight className="xl:size-3 text-base-content" />
        </button>
      </div>
    </div>
  );
};

export default ShowProduk;
