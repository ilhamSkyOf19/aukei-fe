import {
  CircleAlert,
  CircleCheck,
  Clock,
  Coins,
  HandCoins,
  Receipt,
  ReceiptText,
  UsersRound,
} from "lucide-react";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
  getJatuhTempoText,
  getJatuhTempoTextColor,
} from "../../../helpers/helpers";
import useKredit from "./useKredit";
import InputSearch from "../../../components/inputs/InputSearch";
import FilterSort from "../../../components/filters/Sort";
import StatusTempo from "../../../components/filters/StatusTempo";
import { cn } from "../../../utils/cn";
import Avatar from "../../../components/ui/Avatar";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import StatusTransaction from "../../../components/ui/StatusTransaction";
import DataEmpty from "../../../components/messages/DataEmpty";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import NotCompatible from "../../../components/messages/NotCompatible";
import {
  PAYMENT_METHOD_TYPE,
  ROLE_INTERNAL_TYPE,
} from "../../../types/constant.type";
import CardData from "../../../components/ui/cards/CardData";

const Kredit = () => {
  const {
    windowSize,
    setSearch,
    setSort,
    sort,
    setStatus,
    status,
    dataStatistikTempo,
    dataTempo,
    handleLimit,
    handlePage,
    isExistDataTempo,
    isLoadingDataTempo,
    isLoadingStatistikTempo,
    handelRedirectDetail,
    pengguna,
  } = useKredit();
  return (
    <div className="w-full h-screen overflow-y-auto">
      {(windowSize === "lg" && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR) ||
      pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? (
        <div className="w-full mb-30 md:mb-10 lg:mb-20 p-2 flex flex-col justify-start items-center">
          {/* statistik */}
          {pengguna?.role === "OWNER" && (
            <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5">
              <CardStatistik
                icon={{
                  icon: ReceiptText,
                  bgColor: "bg-purple-50",
                  iconColor: "text-purple-600",
                }}
                label="Total transaksi kredit"
                value={
                  dataStatistikTempo?.data?.totalTransaksiKredit &&
                  dataStatistikTempo?.data?.totalTransaksiKredit > 0
                    ? formatNumber(
                        dataStatistikTempo?.data?.totalTransaksiKredit ?? 0,
                      )
                    : "0"
                }
                caption={
                  windowSize === "sm"
                    ? ""
                    : "Seluruh transaksi dengan metode kredit."
                }
                isLoading={isLoadingStatistikTempo}
              />

              <CardStatistik
                icon={{
                  icon: UsersRound,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-600",
                }}
                label="Total pelanggan kredit"
                value={
                  dataStatistikTempo?.data?.totalPelanggan &&
                  dataStatistikTempo?.data?.totalPelanggan > 0
                    ? formatNumber(
                        dataStatistikTempo?.data?.totalPelanggan ?? 0,
                      )
                    : "0"
                }
                caption={
                  windowSize === "sm"
                    ? ""
                    : "Pelanggan yang menggunakan kredit."
                }
                isLoading={isLoadingStatistikTempo}
              />

              <CardStatistik
                icon={{
                  icon: Coins,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                label="Total Tagihan Keseluruhan"
                value={formatRupiah(
                  (dataStatistikTempo?.data?.totalTagihanBelumSelesai ?? 0) +
                    (dataStatistikTempo?.data?.totalTagihanSelesai ?? 0),
                )}
                caption={
                  windowSize === "sm"
                    ? ""
                    : "Akumulasi seluruh nilai tagihan kredit."
                }
                isLoading={isLoadingStatistikTempo}
              />

              <CardStatistik
                icon={{
                  icon: Clock,
                  bgColor: "bg-amber-50",
                  iconColor: "text-amber-400",
                }}
                label="Total Tagihan Belum lunas"
                value={formatRupiah(
                  dataStatistikTempo?.data?.totalTagihanBelumSelesai ?? 0,
                )}
                caption={
                  windowSize === "sm"
                    ? ""
                    : "Sisa tagihan yang masih harus dibayar."
                }
                isLoading={isLoadingStatistikTempo}
              />
              <CardStatistik
                icon={{
                  icon: CircleCheck,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-400",
                }}
                label="Total Tagihan Sudah lunas"
                caption={
                  windowSize === "sm"
                    ? ""
                    : "Tagihan yang telah dilunasi sepenuhnya."
                }
                value={formatRupiah(
                  dataStatistikTempo?.data?.totalTagihanSelesai ?? 0,
                )}
              />
              <CardStatistik
                icon={{
                  icon: CircleAlert,
                  bgColor: "bg-rose-50",
                  iconColor: "text-rose-400",
                }}
                label="Total Tagihan Jatuh Tempo"
                caption={
                  windowSize === "sm"
                    ? ""
                    : "Tagihan yang telah melewati jatuh tempo."
                }
                value={
                  dataStatistikTempo?.data?.totalTagihanJatuhTempo &&
                  dataStatistikTempo.data.totalTagihanJatuhTempo > 0
                    ? formatNumber(
                        dataStatistikTempo.data.totalTagihanJatuhTempo ?? 0,
                      )
                    : "0"
                }
              />
            </div>
          )}

          {/* filter */}
          <div className=" w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-2.5 rounded-2xl lg:rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mt-2.5">
            <div className="w-full md:flex-1 flex flex-row justify-start items-center">
              {/* input search */}
              <InputSearch
                handleSearch={setSearch}
                placeholder="Cari berdasarkan pelanggan ..."
                withLabel
              />
            </div>

            <div className="w-full  md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center md:items-start gap-4 lg:min-h-18 mt-3 md:mt-0">
              {/* filter sort */}
              <FilterSort
                setSort={setSort}
                customWidth="w-full md:w-40"
                value={sort}
              />

              <StatusTempo
                setStatusTempo={setStatus}
                customWidth="w-full md:w-40"
                value={status}
              />
            </div>
          </div>

          {/* DATA SM */}
          <div className="w-full mt-2.5 flex flex-col justify-start items-start bg-base-100 shadow-sm rounded-2xl border border-transparent dark:border-base-content/10 p-2 gap-2.5 lg:hidden">
            {isLoadingDataTempo ? (
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="w-full h-14 skeleton" />
              ))
            ) : isExistDataTempo && !isLoadingDataTempo ? (
              dataTempo?.data?.data.map((item) => (
                <CardData
                  handleRedirectDetail={() =>
                    handelRedirectDetail(item.pelanggan.id)
                  }
                  key={item.id}
                  jatuhTempoTerdekat={item.jatuhTempoTerdekat}
                  pelanggan={item.pelanggan}
                  statusTempo={item.status}
                  totalTransaksiTempo={item.totalTransaksiTempo}
                  metodePembayaran={PAYMENT_METHOD_TYPE.TEMPO}
                  noMetodePembayaran
                />
              ))
            ) : (
              <div className="w-full flex flex-col justify-center items-center">
                <DataEmpty
                  iconData={HandCoins}
                  title="Data Transaksi Kredit Tidak Tersedia"
                  description="Belum ada data transaksi kredit yang dapat ditampilkan saat ini"
                />
              </div>
            )}
          </div>

          {/* DATA LG */}
          <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
            <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
              {/* head */}
              <thead>
                <tr className="h-12 bg-base-200 text-xs">
                  <th>Pelanggan</th>
                  <th>Total Transaksi</th>
                  <th>Belum Lunas</th>
                  <th>Sudah Lunas</th>
                  <th>Jatuh Tempo</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingDataTempo ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={8}>
                        <div className="skeleton h-12 w-full py-1" />
                      </td>
                    </tr>
                  ))
                ) : isExistDataTempo ? (
                  dataTempo?.data?.data.map((item, _) => (
                    <tr
                      key={item.id}
                      className={cn(
                        "transition-all duration-75 ease-in-out h-12 text-base-content text-[0.7rem]",
                        // false === true && "bg-base-200",
                      )}
                    >
                      {/* pelanggan */}
                      <td>
                        <div className="w-full flex flex-row justify-start items-center gap-2">
                          {/* avatar */}
                          <Avatar
                            nama={item.pelanggan.nama}
                            index={item.pelanggan.id}
                            xs
                          />
                          <div className="flex flex-col justify-start items-start">
                            {/* nama */}
                            <span className="font-semibold text-[0.625rem]">
                              {item.pelanggan.nama}
                            </span>
                            {/* no wa */}
                            <span className="text-[0.625rem] text-base-content/50">
                              {formatNumberPhone(item.pelanggan.noWa)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {formatNumber(item.totalTransaksiTempo)} Transaksi
                      </td>
                      <td>
                        <span className="text-error font-medium">
                          {formatRupiah(item.tagihanBelumLunas)}
                        </span>
                      </td>
                      <td>
                        <span className="text-success font-medium">
                          {formatRupiah(item.tagihanLunas)}
                        </span>
                      </td>
                      <td>
                        {item.jatuhTempoTerdekat ? (
                          <div className="flex flex-col justify-start items-start gap-1">
                            <span>
                              {formatTanggalPanjang(
                                item.jatuhTempoTerdekat ?? new Date(),
                              )}
                            </span>
                            <span
                              className={cn(
                                "font-medium text-[0.625rem]",
                                getJatuhTempoTextColor(
                                  item.jatuhTempoTerdekat ?? new Date(),
                                ),
                              )}
                            >
                              {getJatuhTempoText(item.jatuhTempoTerdekat)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium">-</span>
                        )}
                      </td>
                      <td>
                        <StatusTransaction statusTempo={item.status} />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="text-info hover:underline"
                          onClick={() => handelRedirectDetail(item.id)}
                        >
                          detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10}>
                      <div className="w-full h-full flex flex-col justify-center items-center">
                        <DataEmpty
                          iconData={Receipt}
                          title="Data Transaksi Tempo Tidak Tersedia"
                          description="Belum ada data transaksi tempo yang dapat ditampilkan saat ini."
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination limit */}
          <PaginationAndLimit
            currentPage={dataTempo?.data?.meta?.currentPage ?? 1}
            setPage={handlePage}
            totalPage={dataTempo?.data?.meta?.totalPage ?? 0}
            emptyData={!isExistDataTempo}
            isLoading={isLoadingDataTempo}
            limit={dataTempo?.data?.meta?.limit ?? 8}
            setLimit={handleLimit}
          />
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <NotCompatible />
        </div>
      )}
    </div>
  );
};

export default Kredit;
