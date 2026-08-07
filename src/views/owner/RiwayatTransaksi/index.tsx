import {
  Banknote,
  CalendarClock,
  History,
  Landmark,
  QrCode,
} from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../utils/cn";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
} from "../../../helpers/helpers";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import { type PaymentMethodType } from "../../../types/constant.type";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import DataEmpty from "../../../components/messages/DataEmpty";
import Avatar from "../../../components/ui/Avatar";
import FilterStatistik from "../../../components/filters/FilterStatistik";
import CardData from "../../../components/ui/cards/CardData";
import StatusTransaction from "../../../components/ui/StatusTransaction";
import useRiwayatTransaksi from "./useRiwayatTransaksi";
import AlertLabel from "../../../components/messages/AlertLabel";

const RiwayatTransaksi = () => {
  const {
    metodePembayaran,
    handleSetMetodePembayaran,
    handleRedirectDetail,
    dataRiwayatTransaksi,
    handleSearch,
    isExistDataRiwayatTransaksi,
    isLoadingRiwayatTransaksi,
    setLimit,
    setPage,
    setSort,
    sort,
  } = useRiwayatTransaksi();

  return (
    <div className="w-full">
      <div className="w-full  flex flex-col justify-start items-start gap-2.5 px-2.5 pt-2.5">
        <FilterStatistik
          handleSearch={handleSearch}
          filterSort={{
            handleSort: setSort,
            value: sort,
          }}
          filterMetodePembayaran={{
            handleMetodePembayaran: handleSetMetodePembayaran,
            value: metodePembayaran,
          }}
        />
        {/* data untuk mobile */}
        <div className="w-full flex flex-col justify-start items-start bg-base-100 shadow-sm rounded-2xl border border-transparent dark:border-base-content/10 p-2 gap-2.5 order-3 lg:hidden">
          {isLoadingRiwayatTransaksi ? (
            Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-full h-14 skeleton" />
            ))
          ) : isExistDataRiwayatTransaksi && dataRiwayatTransaksi ? (
            dataRiwayatTransaksi?.data?.data.map((item) => (
              <CardData
                handleRedirectDetail={() =>
                  handleRedirectDetail(item.pelanggan.id)
                }
                key={item.id}
                nomorReferensi={item.nomorTransaksi || ""}
                tanggal={item?.completedAt || new Date()}
                metodePembayaran={item.metodePembayaran || "CASH"}
                totalItem={item.totalItem}
                totalTransaksi={item.totalBayar}
                status={item.status}
              />
            ))
          ) : (
            <div className="w-full flex flex-col justify-center items-center">
              <DataEmpty
                iconData={History}
                title="Riwayat Tidak Tersedia"
                description="Belum ada data riwayat yang dapat ditampilkan saat ini"
              />
            </div>
          )}
        </div>
        {/* data untuk > mobile */}
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex">
          <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
            {/* head */}

            {/* buat loading */}
            <thead>
              <tr className="h-12 bg-base-100 text-xs">
                <th>No. Transaksi</th>
                <th>Tanggal</th>
                <th>Kasir</th>
                <th>Pelanggan</th>
                <th>Total Item</th>
                <th>Total Pembayaran</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {false ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={8}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataRiwayatTransaksi ? (
                dataRiwayatTransaksi?.data?.data.map((item, _) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-12 text-base-content text-[0.7rem]",
                      // false === true && "bg-base-200",
                    )}
                  >
                    <td>
                      <span className="font-medium text-info">
                        {item.nomorTransaksi}
                      </span>
                    </td>
                    <td>
                      {formatTanggalLengkap(item.completedAt ?? new Date())}
                    </td>
                    {/* kasir */}
                    <td>
                      {item.kasir ? (
                        <div className="w-full flex flex-row justify-start items-center gap-2">
                          {/* avatar */}
                          <Avatar
                            nama={item.kasir.nama}
                            index={item.kasir.id}
                            xs
                          />
                          <div className="flex flex-col justify-start items-start">
                            {/* nama */}
                            <span className="font-semibold text-[0.625rem]">
                              {item.kasir.nama}
                            </span>
                            {/* no wa */}
                            <span className="text-[0.625rem] text-base-content/50">
                              {item.kasir.username}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-medium italic text-base-content/50">
                          Kasir tidak tersedia
                        </span>
                      )}
                    </td>
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
                    <td>{formatNumber(item.totalItem)} item</td>
                    <td>{formatRupiah(item.totalBayar)}</td>
                    <td>
                      <MetodePembayaranComponent
                        metodePembayaran={item.metodePembayaran || "CASH"}
                      />
                    </td>
                    <td>
                      <StatusTransaction status={item.status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="text-info hover:underline"
                        onClick={() => handleRedirectDetail(item.pelanggan.id)}
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
                        title="Data Riwayat Transaksi Tidak Tersedia"
                        description="Belum ada data riwayat transaksi yang dapat ditampilkan saat ini."
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {/* foot */}
          </table>
        </div>

        {/* alert label */}
        <AlertLabel message="Data diurutkan berdasarkan pelanggan, dengan transaksi terbaru dari setiap pelanggan ditampilkan" />
        {/* pagination */}
        <div className="w-full -mt-2">
          <PaginationAndLimit
            currentPage={dataRiwayatTransaksi?.data?.meta?.currentPage || 1}
            setPage={setPage}
            totalPage={dataRiwayatTransaksi?.data?.meta?.totalPage || 1}
            limit={dataRiwayatTransaksi?.data?.meta?.limit || 8}
            setLimit={setLimit}
          />
        </div>
      </div>
    </div>
  );
};

// metode pembayaran
type MetodePembayaranProps = {
  metodePembayaran: PaymentMethodType;
};
const MetodePembayaranComponent: FC<MetodePembayaranProps> = ({
  metodePembayaran,
}) => {
  return (
    <div className="flex gap-2 flex-row justify-start items-center">
      {metodePembayaran === "TRANSFER" && (
        <Landmark className="size-4 text-blue-400" />
      )}
      {metodePembayaran === "QRIS" && (
        <QrCode className="size-4 text-purple-400" />
      )}
      {metodePembayaran === "CASH" && (
        <Banknote className="size-4 text-emerald-400" />
      )}
      {metodePembayaran === "TEMPO" && (
        <CalendarClock className="size-4 text-amber-400" />
      )}

      <span
        className={cn(
          "font-medium capitalize",
          metodePembayaran === "CASH" && "text-emerald-400",
          metodePembayaran === "QRIS" && "text-purple-400",
          metodePembayaran === "TEMPO" && "text-amber-400",
          metodePembayaran === "TRANSFER" && "text-blue-400",
        )}
      >
        {metodePembayaran.toLowerCase()}
      </span>
    </div>
  );
};

export default RiwayatTransaksi;
