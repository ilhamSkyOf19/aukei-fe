import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import FilterKategori from "../../../../../components/filters/Kategori";
import InputSearch from "../../../../../components/inputs/InputSearch";
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
import Pagination from "../../../../../components/ui/Pagination";
import { cn } from "../../../../../utils/cn";

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
  } = useShowProduk({ pelangganId, step });

  return (
    // MOBILE: flex-1 sebagai default (di dalam parent flex-col milik
    // PilihProduk), lg:flex-5 mengembalikan proporsi lebar asli saat
    // parent kembali flex-row di layar besar.
    <div className="flex-1 lg:flex-5 max-h-full grid grid-rows-2">
      <div className="flex row-span-2 flex-col justify-start text-start gap-2">
        {/* header */}
        {/* MOBILE: flex-col di layar sempit supaya search & filter tidak
            berdesakan, sm:flex-row mengembalikan tampilan satu baris. */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-start border border-transparent dark:border-base-content/10 p-1.5 bg-base-100 shadow-sm rounded-xl gap-2.5">
          {/* search */}
          <div className="w-full sm:flex-3">
            <InputSearch handleSearch={setSearch} placeholder="Cari produk" />
          </div>

          <div className="w-full sm:flex-1 flex flex-row justify-end items-start flex-wrap">
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
        {/* MOBILE: grid-cols-2 sebagai default, sm:grid-cols-3 untuk
            tablet kecil, lg:grid-cols-4 mengembalikan 4 kolom seperti
            desktop asli. */}
        <div
          className={cn(
            "grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 h-full overflow-y-auto scrollbar-thumb-custom-secondary pb-2.5 scrollbar-thin",
          )}
        >
          {/* categori */}

          {/* card */}
          {isLoadingProduk ? (
            // FIX: col-span-4 dulu asumsi grid selalu 4 kolom. Karena
            // sekarang jumlah kolom berubah per breakpoint (2/3/4),
            // col-span-full dipakai supaya loading state selalu
            // memenuhi lebar grid di ukuran layar berapa pun.
            <div className="col-span-full h-120 w-full flex flex-col gap-2.5 justify-center items-center">
              <div className="loading loading-md" />
            </div>
          ) : isExistDataProduk ? (
            dataProduk?.data?.data.map((item, index) => (
              <button
                type="button"
                key={index}
                className="col-span-1 h-60 flex flex-row justify-start items-start group"
                style={{ opacity: 1 }}
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
                    hargaModalRataRata: item.hargaModalRataRata,
                    hargaPpn: item.hargaPpn,
                  })
                }
              >
                <div
                  className={cn(
                    "w-full h-full flex flex-col justify-start items-start border rounded-xl shadow-sm overflow-hidden gap-2 group-hover:shadow-sm transition-all duration-300 ease-in-out bg-base-100 p-1.5",
                    dataChooseProduk?.some((produk) => produk.id === item.id)
                      ? "border-custom-secondary border-2"
                      : "border-transparent dark:border-base-content/10 ",
                  )}
                >
                  <div className="w-full h-120 rounded-xl flex flex-row justify-center items-center overflow-hidden relative">
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

                  <div className="w-full h-80 flex flex-col justify-start items-start gap-3">
                    <div className="w-full flex flex-col justify-start items-start gap-0.5">
                      {/* kategori */}
                      <span className="text-[0.625rem] text-base-content/80 mb-0.5">
                        {item.kategori?.nama}
                      </span>
                      {/* name */}
                      <p className="text-xs text-start font-semibold text-base-content">
                        {`${item.nama}`.length > 30
                          ? item.nama.slice(0, 30) + "..."
                          : item.nama}{" "}
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
                    <div className="w-full flex flex-row justify-between items-start gap-0.5">
                      {/* harga */}
                      <p className="text-xs font-semibold text-base-content font-inter">
                        {item.hargaJual > 1500000
                          ? formatRupiahShort(item.hargaJual)
                          : formatRupiah(item.hargaJual)}
                      </p>

                      {/* stok */}
                      <div
                        className={cn(
                          "h-5 flex flex-row justify-center items-center rounded-full  transition-all ease-in-out duration-300",
                          dataChooseProduk?.some(
                            (produk) => produk.id === item.id,
                          )
                            ? "bg-custom-primary w-auto px-2"
                            : "bg-base-content  text-base-100 w-5 ",
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
                          <Plus className=" size-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            // FIX: col-span-5 sebelumnya tidak pernah cocok dengan
            // grid-cols-4 manapun (bug lama, cuma "kebetulan" tidak
            // terlihat karena cuma 1 anak di baris itu). Diganti
            // col-span-full supaya benar di semua breakpoint.
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

      {/* prev and next */}
      {dataProduk?.data && dataProduk?.data?.meta?.totalPage > 1 && (
        // MOBILE: h-auto + padding vertikal supaya tombol tidak
        // terpotong kalau teks turun baris di layar sangat sempit;
        // sm:h-12 mengembalikan tinggi fixed seperti desktop.
        <div className="w-full row-span-1 flex flex-row justify-between items-center h-auto sm:h-12 py-2 sm:py-0 gap-1.5 p-1.5 border border-transparent dark:border-base-content/10 bg-base-100 rounded-xl">
          {/* button prev */}
          <button
            type="button"
            disabled={dataProduk?.data?.meta?.currentPage === 1}
            className={cn(
              "flex flex-row justify-start items-center gap-1 sm:gap-2 border border-base-content rounded-xl h-full px-2 sm:px-3",
              dataProduk?.data?.meta?.currentPage === 1
                ? "opacity-50"
                : " hover:shadow-sm hover:shadow-custom-primary hover:border-custom-primary hover:scale-102 transition-all duration-150 ease-in-out origin-center",
            )}
            onClick={() => handlePage("prev")}
          >
            <ArrowLeft className="size-3 xl:size-3 text-base-content" />
            {/* MOBILE: label disembunyikan di layar sangat sempit (cukup
                ikon panah) supaya tombol tidak melebar & mendorong
                komponen Pagination di tengah; muncul lagi mulai sm. */}
            <span className="hidden sm:inline text-[0.625rem] xl:text-[0.625rem] font-semibold text-base-content">
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

          {/* button next */}
          <button
            type="button"
            disabled={
              dataProduk?.data?.meta?.currentPage ===
              dataProduk?.data?.meta?.totalPage
            }
            className={cn(
              "flex flex-row justify-start items-center gap-1 sm:gap-2 border border-base-content rounded-xl h-full px-2 sm:px-3",
              dataProduk?.data?.meta?.currentPage ===
                dataProduk?.data?.meta?.totalPage
                ? "opacity-50"
                : " hover:shadow-sm hover:shadow-custom-primary hover:border-custom-primary hover:scale-102 transition-all duration-150 ease-in-out origin-center",
            )}
            onClick={() => handlePage("next")}
          >
            <span className="hidden sm:inline text-[0.625rem] xl:text-[0.625rem] font-semibold text-base-content">
              Selanjutnya
            </span>
            <ArrowRight className="size-3 xl:size-3 text-base-content" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowProduk;
