import FilterSort from "../../../components/filters/Sort";
import InputSearch from "../../../components/inputs/InputSearch";
import ButtonRefresh from "../../../components/ui/button/ButtonRefresh";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import { cn } from "../../../utils/cn";
import NotifikasiPengajuanBarang from "./NotifikasiPengajuanBarang";
import NotifikasiProduk from "./NotifikasiProduk";
import NotifikasiTempo from "./NotifikasiTempo";
import useNotifikasi from "./useNotifikasi";

const Notifikasi = () => {
  const {
    pilihan,
    selectedNotifikasi,
    handleSelected,
    limit,
    page,
    search,
    setLimit,
    setPage,
    setSearch,
    setSort,
    sort,
    handleRefresh,
    notifikasiProdukRef,
    handleRedirectDetail,
    pengguna,
  } = useNotifikasi();

  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-start items-stretch gap-2.5 px-2 pt-2.5">
        {/* pilihan */}
        <div className="flex-2 w-full flex flex-col justify-start items-start">
          <div
            className={cn(
              "bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col justify-start items-start sticky",
              pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? "top-14" : "top-0",
            )}
          >
            {/* title */}
            <div className="flex flex-col justify-start items-start gap-0.5">
              <h3 className="text-sm font-semibold text-base-content">
                Notifikasi
              </h3>

              <span className="text-[0.625rem] font-medium text-base-content/70">
                Silahkan pilih tipe notifikasi
              </span>
            </div>

            {/* pilihan */}
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              {/* btn */}
              {pilihan.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "w-full h-12 rounded-2xl md:rounded-xl border flex flex-row justify-start items-center gap-2.5 px-2.5 transition-all duration-100 ease-in-out",
                    selectedNotifikasi === item.key
                      ? "border-custom-secondary bg-custom-primary shadow-md text-custom-secondary"
                      : "border-base-content/10 hover:border-custom-secondary text-base-content hover:bg-custom-primary/10",
                  )}
                  onClick={() => handleSelected(item.key)}
                >
                  {/* icon */}
                  <item.icon className={cn("size-5")} />

                  <span className="text-xs font-medium text-left">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* content */}
        <div className="flex-5 flex flex-col justify-start items-start">
          {/* filter */}
          <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mb-2.5">
            <div className="w-full md:flex-1 flex flex-col justify-start items-start gap-1.5">
              <InputSearch
                value={search ?? ""}
                handleSearch={setSearch}
                placeholder="Cari notifikasi ..."
                withLabel
              />
            </div>
            <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-end gap-3 md:gap-4 mt-3 md:mt-0">
              {/* filter sort */}
              <FilterSort
                setSort={setSort}
                customWidth="w-full md:w-30"
                value={sort}
              />

              {/* button refresh */}
              <ButtonRefresh handleRefresh={handleRefresh} />
            </div>
          </div>

          {/* data produk */}
          {selectedNotifikasi === "produk" && (
            <NotifikasiProduk
              ref={notifikasiProdukRef}
              limit={limit}
              page={page}
              search={search}
              sort={sort}
              {...(pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && {
                handleRedirectDetail: (id: number) =>
                  handleRedirectDetail({ id }),
              })}
            />
          )}

          {/* data tempo */}
          {selectedNotifikasi === "tempo" && (
            <NotifikasiTempo
              ref={notifikasiProdukRef}
              limit={limit}
              page={page}
              search={search}
              sort={sort}
              handleRedirectDetail={(params: {
                pelangganId: number;
                tempoId: number;
              }) =>
                handleRedirectDetail({
                  pelangganId: params.pelangganId,
                  id: params.tempoId,
                })
              }
              setLimit={setLimit}
              setPage={setPage}
            />
          )}

          {/* data pengajuan barang */}
          {selectedNotifikasi === "pengajuanBarang" && (
            <NotifikasiPengajuanBarang
              ref={notifikasiProdukRef}
              limit={limit}
              page={page}
              search={search}
              sort={sort}
              handleRedirectPengajuanBarangDetail={(params: {
                barangMasukId?: number;
                barangKeluarId?: number;
              }) =>
                handleRedirectDetail({
                  barangMasukId: params.barangMasukId,
                  barangKeluarId: params.barangKeluarId,
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;
