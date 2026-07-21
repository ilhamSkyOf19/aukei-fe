import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Clock,
  Coins,
  Receipt,
} from "lucide-react";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import useKreditDetail from "./useKreditDetail";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
  getJatuhTempoTextColor,
  getWeekFromPeriod,
} from "../../../helpers/helpers";
import Avatar from "../../../components/ui/Avatar";
import { cn } from "../../../utils/cn";
import InputSearch from "../../../components/inputs/InputSearch";
import FilterSort from "../../../components/filters/Sort";
import {
  formatTanggalLengkap,
  formatTanggalPanjang,
} from "../../../helpers/formatDate";
import { differenceInDays } from "date-fns";
import StatusTransaction from "../../../components/ui/StatusTransaction";
import DataEmpty from "../../../components/messages/DataEmpty";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import NotCompatible from "../../../components/messages/NotCompatible";

const filterStatus: { label: string; value: string }[] = [
  {
    label: "Semua Transaksi",
    value: "semua",
  },
  {
    label: "Belum Lunas",
    value: "unpaid",
  },
  {
    label: "Lunas",
    value: "paid",
  },
];

const KreditDetail = () => {
  const {
    dataStatistikTempo,
    isLoadingStatistikTempo,
    windowSize,
    navigate,
    setStatus,
    status,
    dataTempo,
    handleLimit,
    handlePage,
    isExistDataTempo,
    isLoadingDataTempo,
    setSearch,
    setSort,
    sort,
    handleRedirectDetail,
  } = useKreditDetail();

  return (
    <div className="w-full h-screen overflow-y-auto">
      {windowSize === "lg" ? (
        <div className="w-full mb-30 md:mb-10 lg:mb-20 p-2 flex flex-col justify-start items-center">
          {/* statistik */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5">
            {/* data pelanggan */}
            <div className="flex flex-col justify-start items-start gap-2.5 ">
              {/* back */}
              <button
                type="button"
                onClick={() => navigate("/dashboard/kredit")}
                className="flex flex-row justify-start items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-150 ease-in-out"
              >
                {/* icon */}
                <ArrowLeft className="size-4 text-base-content" />
                <span className="text-base-content text-xs font-medium">
                  Kembali
                </span>
              </button>
            </div>

            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="col-span-1 flex flex-row justify-start items-center gap-4 border p-2 rounded-lg border-base-content/10">
                <Avatar
                  nama={dataStatistikTempo?.data?.pelanggan?.nama ?? ""}
                  index={dataStatistikTempo?.data?.pelanggan?.id}
                />
                <div className="w-full flex flex-col justify-start items-start gap-1">
                  <div className="w-full flex flex-row justify-between items-center md:gap-12">
                    <p className="text-base-content text-sm font-semibold">
                      {dataStatistikTempo?.data?.pelanggan?.nama}
                    </p>

                    {/* status */}
                    <p
                      className={cn(
                        "px-2 py-0.5  font-medium text-[0.625rem] rounded-md flex justify-center items-center",
                        dataStatistikTempo?.data?.pelanggan?.isActive
                          ? "bg-emerald-100 text-emerald-400"
                          : "bg-rose-100 text-rose-400",
                      )}
                    >
                      {dataStatistikTempo?.data?.pelanggan?.isActive
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </p>
                  </div>

                  <span className="text-[0.625rem]  md:text-xs text-base-content ">
                    {formatNumberPhone(
                      dataStatistikTempo?.data?.pelanggan?.noWa ?? "",
                    )}
                  </span>
                </div>
              </div>

              <CardStatistik
                icon={{
                  icon: Receipt,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-600",
                }}
                label="Total Transaksi"
                value={
                  dataStatistikTempo?.data?.totalTransaksiKredit &&
                  dataStatistikTempo?.data?.totalTransaksiKredit > 0
                    ? formatNumber(
                        dataStatistikTempo?.data?.totalTransaksiKredit ?? 0,
                      )
                    : "0"
                }
                caption="Total transaksi kredit"
                isLoading={isLoadingStatistikTempo}
              />
              <CardStatistik
                icon={{
                  icon: Coins,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                label="Total Tagihan"
                value={formatRupiah(
                  (dataStatistikTempo?.data?.totalTagihanBelumSelesai ?? 0) +
                    (dataStatistikTempo?.data?.totalTagihanSelesai ?? 0),
                )}
                caption="Keseluruhan"
                isLoading={isLoadingStatistikTempo}
              />

              <CardStatistik
                icon={{
                  icon: Clock,
                  bgColor: "bg-amber-50",
                  iconColor: "text-amber-400",
                }}
                label="Total Tagihan"
                value={formatRupiah(
                  dataStatistikTempo?.data?.totalTagihanBelumSelesai ?? 0,
                )}
                caption="Belum lunas"
              />

              <CardStatistik
                icon={{
                  icon: CircleCheck,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-400",
                }}
                label="Total Tagihan"
                value={formatRupiah(
                  dataStatistikTempo?.data?.totalTagihanSelesai ?? 0,
                )}
                caption="Sudah lunas"
              />

              <CardStatistik
                icon={{
                  icon: CircleAlert,
                  bgColor: "bg-rose-50",
                  iconColor: "text-rose-400",
                }}
                label="Total Kredit"
                value={
                  dataStatistikTempo?.data?.totalTagihanJatuhTempo &&
                  dataStatistikTempo.data.totalTagihanJatuhTempo > 0
                    ? formatNumber(
                        dataStatistikTempo.data.totalTagihanJatuhTempo ?? 0,
                      )
                    : "0"
                }
                caption="Jatuh Tempo"
              />
            </div>
          </div>

          {/* filter */}
          <div className="w-full flex flex-col md:flex-row justify-start items-start gap-4 md:gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5 mt-2.5">
            <div className="flex-1 order-2 md:order-1">
              <div role="tablist" className="tabs tabs-border">
                {filterStatus.map((item, index) => (
                  <a
                    key={index}
                    role="tab"
                    onClick={() => setStatus(item.value)}
                    className={cn(
                      "tab text-xs",
                      item.value === (status || "semua")
                        ? "text-emerald-600 tab-active"
                        : "text-base-content",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full order-1 md:order-2 md:flex-1 flex flex-row justify-start items-start gap-2.5">
              <InputSearch
                handleSearch={setSearch}
                placeholder="Cari nomor transaksi ..."
              />

              <FilterSort
                setSort={setSort}
                customWidth="w-40"
                noLabel
                value={sort}
              />
            </div>
          </div>

          {/* DATA LG */}
          <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
            <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
              {/* head */}
              <thead>
                <tr className="h-12 bg-base-200 text-xs">
                  <th>No. Transaksi</th>
                  <th>Total Tagihan</th>
                  <th>Belum Lunas</th>
                  <th>Lunas</th>
                  <th>Tenor</th>
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
                      <td>
                        <div className="flex flex-col justify-start items-start">
                          <span className="font-medium text-info">
                            {item?.nomorTransaksi}
                          </span>
                          <span className="text-[0.625rem]">
                            {formatTanggalLengkap(item.tanggalTransaksi)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-medium">
                          {formatRupiah(item.totalTagihan)}
                        </span>
                      </td>
                      <td>
                        <span className="text-amber-500 font-medium">
                          {formatRupiah(item.tagihanBelumLunas)}
                        </span>
                      </td>
                      <td>
                        <span className="text-success font-medium">
                          {formatRupiah(item.tagihanLunas)}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col justify-start items-start">
                          <span className="text-[0.625rem]">{`${(item.periode ?? 0) * (item.jumlahCicilan ?? 0)} Hari / ${getWeekFromPeriod((item.periode ?? 0) * (item.jumlahCicilan ?? 0))} Minggu`}</span>
                          <span className="text-[0.625rem]">{`${item.jumlahCicilan} Kali`}</span>
                        </div>
                      </td>
                      <td>
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
                            (
                            {formatNumber(
                              differenceInDays(
                                item.jatuhTempoTerdekat ?? new Date(),
                                new Date(),
                              ),
                            )}{" "}
                            Hari lagi )
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col justify-start items-start gap-1.5">
                          <StatusTransaction statusTempo={item.status} />
                          <span className="text-[0.625rem] font-medium text-base-content/70">
                            {item.sisaCicilanBelumSelesai} /{" "}
                            {item.jumlahCicilan} Cicilan
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="text-info hover:underline"
                          onClick={() => handleRedirectDetail(item.id)}
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
              {/* foot */}
              <tfoot>
                <tr>
                  {!true && true && [1].length! > 8 ? (
                    <>
                      <th>No. Transaksi</th>
                      <th>Total Tagihan</th>
                      <th>Belum Lunas</th>
                      <th>Lunas</th>
                      <th>Tenor</th>
                      <th>Jatuh Tempo</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </>
                  ) : (
                    <>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* pagination */}
          <PaginationAndLimit
            currentPage={dataTempo?.data?.meta?.currentPage ?? 1}
            setPage={handlePage}
            totalPage={dataTempo?.data?.meta?.totalPage ?? 1}
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

export default KreditDetail;
