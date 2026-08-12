import { History, HistoryIcon } from "lucide-react";

import useContentSideBar from "../../hooks/useContentSideBar";
import useSideBarRiwayatPembayaranTempo from "./useSideBarRiwayatPembayaranTempo";
import type { FC } from "react";
import { cn } from "../../utils/cn";
import { formatRupiah } from "../../helpers/helpers";
import { formatTanggalLengkap } from "../../helpers/formatDate";
import { statusMetodePembayaranStyle } from "../../types/statusStyle";
import PaginationAndLimit from "../filters/PaginationAndLimit";
import DataEmpty from "../messages/DataEmpty";
import StatusInstallment from "../ui/StatusInstallment";
import type { ResponseTransactionPaymentType } from "../../models/paymentTransaction.model";
import CardPaymentTransaction from "../ui/cards/CardPaymentTransaction";

type Props = {
  jumlahCicilan: number;
  paymentTransactions?: Pick<
    ResponseTransactionPaymentType,
    | "id"
    | "jenis"
    | "kasir"
    | "keterangan"
    | "metodePembayaran"
    | "nominal"
    | "createdAt"
    | "diBayar"
    | "kembalian"
  >[];
  customBtnWidth?: string;
  classHidden?: string;
};

const SideBarRiwayatPembayaranTempo: FC<Props> = ({
  jumlahCicilan,
  paymentTransactions,
  customBtnWidth,
  classHidden,
}) => {
  // call use
  const {
    dataRiwayat,
    isExistDataPayment,
    isLoadingRiwayat,
    handleSetCicilanKe,
    setPage,
    cicilanKe,
  } = useSideBarRiwayatPembayaranTempo();

  const { drawerRef, handleClose, handleOpen } = useContentSideBar();

  return (
    <div className={cn("drawer drawer-end", classHidden)}>
      <input
        ref={drawerRef}
        id="my-drawer-5"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-row justify-end items-end">
        {/* Page content here */}
        <button
          type="button"
          onClick={handleOpen}
          className={cn(
            "drawer-button h-10.5 md:h-9 rounded-xl bg-custom-primary shadow-xs flex flex-row justify-center items-center gap-2 px-3 hover-overlay",
            customBtnWidth ?? "w-auto",
          )}
        >
          <History className="size-4 text-custom-secondary" />
          <span className="text-xs md:text-[0.7rem] font-medium text-custom-secondary">
            Lihat Riwayat Pembayaran Cicilan
          </span>
        </button>
      </div>

      {/* drawer side */}
      <div className="drawer-side">
        <label
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={handleClose}
        />
        <div className="menu bg-base-100 h-screen w-80 md:w-100 overflow-hidden">
          <div className="w-full h-full flex flex-col justify-start items-start p-2.5">
            <div className="w-full flex flex-col justify-start items-start mb-2.5 gap-1">
              <h1 className="text-base font-semibold text-base-content">
                Riwayat Pembayaran Cicilan
              </h1>

              <span className="text-xs text-base-content/50">
                Berikut adalah riwayat pembayaran cicilan dari transaksi ini.
              </span>
            </div>

            {/* choose cicilan */}
            <span className="text-xs font-medium text-base-content my-2">
              Pilih Cicilan
            </span>
            <div
              role="tablist"
              className="tabs tabs-box gap-2.5 p-2.5 w-full flex flex-row justify-start items-center overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-custom-secondary border border-base-content/10 shrink-0"
            >
              <a
                role="tab"
                onClick={() => handleSetCicilanKe("dp")}
                className={cn(
                  "tab text-xs shrink-0 ",
                  cicilanKe === "dp"
                    ? "text-primary-white tab-active bg-custom-secondary"
                    : "text-base-content",
                )}
              >
                Uang Muka
              </a>

              {Array.from({ length: jumlahCicilan }, (_, i) => (
                <a
                  key={i}
                  role="tab"
                  onClick={() => handleSetCicilanKe(i + 1)}
                  className={cn(
                    "tab text-xs shrink-0 ",
                    typeof cicilanKe === "number" && Number(cicilanKe) === i + 1
                      ? "text-primary-white tab-active bg-custom-secondary"
                      : "text-base-content",
                  )}
                >
                  Cicilan {i + 1}
                </a>
              ))}
            </div>

            {/* daftar riwayat */}
            <div className="w-full flex flex-col justify-start items-start mt-4">
              {/* title */}
              <div className="w-full flex flex-row justify-between items-start">
                <span className="text-sm font-medium">Daftar Riwayat</span>
                <span className="text-xs font-medium">
                  {typeof cicilanKe === "number"
                    ? `Cicilan ${cicilanKe}`
                    : "Pembayaran Uang DP"}
                </span>
              </div>

              {typeof cicilanKe === "number" && (
                <div className="w-full h-[65vh] scrollbar-thin scrollbar-thumb-custom-secondary overflow-y-auto flex flex-col justify-start items-start py-2.5">
                  {isLoadingRiwayat ? (
                    <div className="w-full flex flex-col justify-start items-start gap-2.5 mt-6">
                      <div className="skeleton w-full h-28" />
                      <div className="skeleton w-full h-28" />
                    </div>
                  ) : isExistDataPayment ? (
                    dataRiwayat?.data?.data?.payments?.map((item, index) => {
                      const lastIndex =
                        index !==
                        (dataRiwayat?.data?.data?.payments?.length || 0) - 1;
                      const style =
                        statusMetodePembayaranStyle[item.metodePembayaran];

                      return (
                        <div
                          key={item.id}
                          className="relative grid grid-cols-[36px_1fr] gap-1.5 my-1.5 w-full"
                        >
                          <div className="relative flex justify-center">
                            {lastIndex && (
                              <div className="absolute top-6.5 h-[93%] -bottom-6 left-1/2 w-px -translate-x-1/2 bg-base-content/20" />
                            )}

                            {/* dot */}
                            <div
                              className={cn(
                                "mt-1 h-6 w-6 md:h-5.5 md:w-5.5 rounded-full border relative flex flex-row justify-center items-center",
                                style.borderDot,
                              )}
                            >
                              <div
                                className={cn(
                                  "w-2.5 h-2.5 md:w-2 md:h-2 rounded-full bg-base-content",
                                  style.dot,
                                )}
                              />
                            </div>
                          </div>
                          <article className="w-[95%] max-w-full rounded-2xl md:rounded-xl border border-base-content/10 bg-base-100 p-2.5">
                            <div className="w-full flex flex-row justify-between items-start">
                              {/* author */}
                              <div className="w-full flex flex-col justify-start items-start gap-2">
                                {/* nama & tanggal */}
                                <div className="w-full flex flex-row justify-between items-center">
                                  <span className="text-sm text-base-content font-semibold">
                                    {formatRupiah(item.nominal)}
                                  </span>

                                  <span className="text-[0.625rem] text-base-content">
                                    {formatTanggalLengkap(item.tanggalBayar)}
                                  </span>
                                </div>

                                {/* kasir & metode pembayaran */}
                                <div className="w-full flex flex-row justify-start items-center gap-2.5">
                                  <div className="flex flex-row justify-start items-center gap-1.5">
                                    {/* kasir */}
                                    <div className="flex flex-row justify-start items-center pr-2.5 border-r border-base-content/30">
                                      <span className="text-[0.7rem] text-base-content">
                                        {item.kasir.nama}
                                      </span>
                                    </div>
                                    <span className="text-[0.625rem] text-base-content">
                                      {item.metodePembayaran}
                                    </span>
                                  </div>

                                  {index === 0 && (
                                    <div className="w-full flex flex-row justify-end items-center">
                                      <StatusInstallment
                                        status={dataRiwayat.data?.data?.status}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div
                              className={cn(
                                "w-full p-2.5 mt-2.5 border border-base-content/10 rounded-2xl md:rounded-xl flex flex-col justify-start items-start gap-1.5",
                              )}
                            >
                              {/* label */}
                              <span className="text-xs font-semibold text-base-content">
                                Keterangan
                              </span>

                              <p className="text-[0.625rem] text-base-content">
                                {item.keterangan === ""
                                  ? "Tidak ada keterangan"
                                  : item.keterangan}
                              </p>
                            </div>
                          </article>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-60 flex justify-center items-center">
                      <DataEmpty
                        iconData={HistoryIcon}
                        title="Tidak Ada Riwayat"
                        description="Belum ada data riwayat yang dapat ditampilkan"
                        xs
                      />
                    </div>
                  )}

                  {/* pagination */}
                  {(dataRiwayat?.data?.meta?.totalPage ?? 1) >= 2 && (
                    <div className="w-full flex-1">
                      <PaginationAndLimit
                        currentPage={dataRiwayat?.data?.meta?.currentPage ?? 1}
                        setPage={setPage}
                        totalPage={dataRiwayat?.data?.meta?.totalPage ?? 1}
                        isLoading={isLoadingRiwayat}
                        customWindowSize={3}
                      />
                    </div>
                  )}
                </div>
              )}

              {cicilanKe === "dp" && (
                <div className="w-full h-[65vh] scrollbar-thin scrollbar-thumb-custom-secondary overflow-y-auto flex flex-col justify-start items-start py-2.5 gap-2.5">
                  {paymentTransactions && paymentTransactions?.length > 0 ? (
                    paymentTransactions.map((item) => (
                      <CardPaymentTransaction
                        key={item.id}
                        paymentTransactions={item}
                      />
                    ))
                  ) : (
                    <div className="w-full h-60 flex justify-center items-center">
                      <DataEmpty
                        iconData={HistoryIcon}
                        title="Tidak Ada Riwayat"
                        description="Belum ada data riwayat yang dapat ditampilkan"
                        xs
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarRiwayatPembayaranTempo;
