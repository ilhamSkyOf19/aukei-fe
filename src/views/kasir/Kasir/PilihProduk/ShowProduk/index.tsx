import { Plus } from "lucide-react";
import InputSearch from "../../../../../components/inputs/InputSearch";
import FilterKategori from "../../../../../components/filters/Kategori";
import useShowProduk from "./useShowProduk";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
} from "../../../../../helpers/helpers";
import type {
  DetailsForCreate,
  ProdukDetailItem,
} from "../../../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../../../models/produk.model";
import { type FC } from "react";
import DataEmpty from "../../../../../components/messages/DataEmpty";
import { cn } from "../../../../../utils/cn";
import useInfiniteScroll from "../../../../../hooks/useInfiniteScroll";

// props
type Props = {
  pelangganId?: number;
  handleShowModalFormulirTransaksi: (
    produk: Pick<DetailsForCreate, "hargaJual" | "produkId" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
        diskon?: number;
        detailId?: number;
        hargaModalRataRata: number;
      },
  ) => void;
  step: number;
  dataChooseProduk?: ProdukDetailItem[];
};

const ShowProduk: FC<Props> = ({
  pelangganId,
  step,
  handleShowModalFormulirTransaksi,
  dataChooseProduk,
}) => {
  // call use
  const {
    produk,
    handleKategori,
    isLoadingProduk,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    setSearch,
    isExistDataProduk,
    kategori,
  } = useShowProduk({ pelangganId, step });

  const { containerRef: produkContainerRef, loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    rootMargin: "200px",
  });

  return (
    <div className="flex-1 lg:flex-5 max-h-full grid grid-rows-2">
      <div className="flex row-span-2 flex-col justify-start text-start gap-2">
        {/* header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-start border border-transparent dark:border-base-content/10 p-1.5 bg-base-100 shadow-sm rounded-xl gap-2.5">
          {/* search */}
          <div className="w-full sm:flex-3">
            <InputSearch handleSearch={setSearch} placeholder="Cari produk" />
          </div>

          {/* filter */}
          <div className="w-full sm:flex-1 flex flex-row justify-end items-start flex-wrap">
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
          ref={produkContainerRef}
          className={cn(
            "grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 h-full overflow-y-auto scrollbar-thumb-custom-secondary pb-2.5 scrollbar-thin",
          )}
        >
          {/* loading pertama */}
          {isLoadingProduk ? (
            <div className="col-span-full h-120 w-full flex flex-col gap-2.5 justify-center items-center">
              <div className="loading loading-md" />
            </div>
          ) : isExistDataProduk ? (
            <>
              {/* card produk */}
              {produk.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="col-span-1 h-60 flex flex-row justify-start items-start group"
                  style={{ opacity: 1 }}
                  onClick={() =>
                    handleShowModalFormulirTransaksi({
                      produkId: item.id,
                      nama: item.nama,
                      img: item.img,
                      hargaJual: item.hargaJual,
                      kode: item.kode,
                      hargaJualTerakhirTransaksi:
                        item.hargaJualTerakhirTransaksi,
                      diskon: 0,
                      quantity: 1,
                      stok: item.stok,
                      hargaModalRataRata: item.hargaModalRataRata,
                      hargaPpn: item.hargaPpn,
                    })
                  }
                >
                  <div
                    className={cn(
                      "w-full h-full flex flex-col justify-start items-start rounded-xl shadow-sm overflow-hidden gap-2 bg-base-100 p-1.5 border border-transparent transition-colors",
                      dataChooseProduk?.some((produk) => produk.id === item.id)
                        ? "border-custom-secondary"
                        : "hover:border-custom-secondary",
                    )}
                  >
                    {/* image */}
                    <div className="w-full h-100 rounded-xl flex flex-row justify-center items-center overflow-hidden relative">
                      {/* stok */}
                      <div className="px-2.5 h-5 flex flex-row justify-center items-center absolute bg-custom-primary rounded-full top-2 right-2">
                        <span className="text-[0.625rem] font-medium text-custom-secondary">
                          {formatNumber(item.stok)} STOK
                        </span>
                      </div>

                      <img
                        src={item.img}
                        alt="foto produk"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* informasi produk */}
                    <div className="w-full h-80 flex flex-col justify-start items-start gap-3">
                      <div className="w-full flex flex-col justify-start items-start gap-0.5">
                        {/* kategori */}
                        <span className="text-[0.625rem] text-base-content/80 mb-0.5">
                          {item.kategori?.nama}
                        </span>

                        {/* nama */}
                        <p className="text-xs text-start font-semibold text-base-content">
                          {`${item.nama}`.length > 30
                            ? item.nama.slice(0, 30) + "..."
                            : item.nama}
                        </p>

                        {/* kode */}
                        <div className="flex gap-1.5 flex-row justify-start items-start">
                          <span className="text-[0.625rem] text-base-content/80">
                            Kode :
                          </span>

                          <span className="text-[0.625rem] font-medium text-base-content/80">
                            {item.kode ?? "-"}
                          </span>
                        </div>
                      </div>

                      {/* harga & pilih */}
                      <div className="w-full flex flex-row justify-between items-start gap-0.5">
                        {/* harga */}
                        <p className="text-xs font-semibold text-base-content font-inter">
                          {item.hargaJual > 1500000
                            ? formatRupiahShort(item.hargaJual)
                            : formatRupiah(item.hargaJual)}
                        </p>

                        {/* stok / quantity */}
                        <div
                          className={cn(
                            "h-5 flex flex-row justify-center items-center rounded-full transition-all ease-in-out duration-300",
                            dataChooseProduk?.some(
                              (produk) => produk.id === item.id,
                            )
                              ? "bg-custom-primary w-auto px-2"
                              : "bg-base-content text-base-100 w-5",
                          )}
                        >
                          {dataChooseProduk?.some(
                            (produk) => produk.id === item.id,
                          ) ? (
                            <span className="text-[0.625rem] font-medium">
                              {
                                dataChooseProduk?.find(
                                  (produk) => produk.id === item.id,
                                )?.quantity
                              }
                            </span>
                          ) : (
                            <Plus className="size-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* trigger infinite scroll */}
              <div
                ref={loadMoreRef}
                className="col-span-full w-full flex flex-row justify-center items-center py-3 min-h-10"
              >
                {isFetchingNextPage && <div className="loading loading-md" />}
              </div>
            </>
          ) : (
            <div className="col-span-full h-90">
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
    </div>
  );
};

export default ShowProduk;
