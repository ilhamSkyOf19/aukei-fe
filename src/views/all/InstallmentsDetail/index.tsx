import {
  CalendarDays,
  CircleCheck,
  Clock,
  CreditCard,
  HandCoins,
  ListOrdered,
  ReceiptText,
} from "lucide-react";
import useInstallmentsDetail from "./useInstallmentsDetail";
import Avatar from "../../../components/ui/Avatar";
import { cn } from "../../../utils/cn";
import {
  formatNumberPhone,
  formatRupiah,
  getJatuhTempoText,
  getJatuhTempoTextColor,
  getWeekFromPeriod,
} from "../../../helpers/helpers";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import DataEmpty from "../../../components/messages/DataEmpty";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import StatusInstallment from "../../../components/ui/StatusInstallment";
import {
  INSTALLMENT_STATUS_TYPE,
  ROLE_INTERNAL_TYPE,
} from "../../../types/constant.type";
import CardPembayaran from "./CardPembayaran";
import NotCompatible from "../../../components/messages/NotCompatible";
import AlertLabelList from "../../../components/messages/AlertLabelList";
import SideBarRiwayatPembayaranTempo from "../../../components/SideBarRiwayatPembayaranTempo";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";

const InstallmentsDetail = () => {
  const {
    dataInstallments,
    isExistDataInstallments,
    isLoadingDataInstallments,
    navigate,
    windowSize,
    currentPathname,
    dataPembayaran,
    setDataPembayaran,
    handleResetDataPembayaran,
    validatedId,
    pengguna,
  } = useInstallmentsDetail();

  return (
    <div className="w-full h-screen overflow-y-auto">
      {windowSize === "lg" ? (
        <div className="w-full mb-30 md:mb-10 lg:mb-20 p-2 flex flex-col justify-start items-start">
          <ButtonBackText
            handleClick={() =>
              navigate(currentPathname.split("/").slice(0, -2).join("/"))
            }
          />
          {/* statistik */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5 mt-2.5">
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* pelanggan */}
              <div className="col-span-1 relative flex flex-row justify-start items-center gap-4 border p-2 rounded-2xl md:rounded-xl border-base-content/10">
                <div className="absolute top-2 right-2">
                  {/* status */}
                  <p
                    className={cn(
                      "px-2 py-0.5  font-medium text-[0.625rem] rounded-md flex justify-center items-center",
                      dataInstallments?.data?.pelanggan?.isActive
                        ? "bg-emerald-100 text-emerald-400"
                        : "bg-rose-100 text-rose-400",
                    )}
                  >
                    {dataInstallments?.data?.pelanggan?.isActive
                      ? "Aktif"
                      : "Tidak Aktif"}
                  </p>
                </div>

                <Avatar
                  nama={dataInstallments?.data?.pelanggan?.nama ?? ""}
                  index={dataInstallments?.data?.pelanggan?.id}
                />
                <div className="w-full flex flex-col justify-start items-start gap-1">
                  <div className="w-full flex flex-row justify-between items-center md:gap-12">
                    <p className="text-base-content text-sm font-semibold">
                      {dataInstallments?.data?.pelanggan?.nama}
                    </p>
                  </div>

                  <span className="text-[0.625rem]  md:text-xs text-base-content ">
                    {formatNumberPhone(
                      dataInstallments?.data?.pelanggan?.noWa ?? "",
                    )}
                  </span>
                </div>
              </div>

              {/* informasi transaksi */}

              <CardStatistik
                icon={{
                  icon: ReceiptText,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                statusTempo={dataInstallments?.data?.statusTempo}
                label="No. Transaksi"
                value={dataInstallments?.data?.nomorTransaksi ?? ""}
                caption="Nomor transaksi."
                isLoading={isLoadingDataInstallments}
              />

              <CardStatistik
                icon={{
                  icon: ReceiptText,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                label="Total Tagihan"
                value={formatRupiah(dataInstallments?.data?.totalTagihan ?? 0)}
                caption="Keseluruhan."
                isLoading={isLoadingDataInstallments}
                withAlert="Total tagihan setelah DP"
              />

              <CardStatistik
                icon={{
                  icon: HandCoins,
                  bgColor: "bg-purple-50",
                  iconColor: "text-purple-400",
                }}
                label="Uang Muka (DP)"
                value={formatRupiah(dataInstallments?.data?.uangMuka ?? 0)}
                caption="Total uang muka yang dibayar."
                isLoading={isLoadingDataInstallments}
              />

              <CardStatistik
                icon={{
                  icon: Clock,
                  bgColor: "bg-amber-50",
                  iconColor: "text-amber-400",
                }}
                label="Total Tagihan"
                value={formatRupiah(dataInstallments?.data?.sisaTagihan ?? 0)}
                caption="Belum lunas."
              />

              <CardStatistik
                icon={{
                  icon: CircleCheck,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-400",
                }}
                label="Total Tagihan"
                value={formatRupiah(
                  dataInstallments?.data?.totalTagihanLunas ?? 0,
                )}
                caption="Sudah lunas."
              />

              <CardStatistik
                icon={{
                  icon: CalendarDays,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                label="Tenor"
                value={`${(dataInstallments?.data?.periode ?? 0) * (dataInstallments?.data?.jumlahCicilan ?? 0)} Hari / ${getWeekFromPeriod((dataInstallments?.data?.periode ?? 0) * (dataInstallments?.data?.jumlahCicilan ?? 0))} Minggu`}
                caption="Jumlah Tenor."
              />

              <CardStatistik
                icon={{
                  icon: ListOrdered,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-400",
                }}
                label="Cicilan"
                value={`${dataInstallments?.data?.sisaCicilanBelumSelesai} / ${dataInstallments?.data?.jumlahCicilan} Cicilan`}
                caption="Progres Cicilan."
              />
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-start gap-2.5">
            {/* informasi installment */}
            <div className="flex-2 flex flex-col justify-start items-start gap-2.5">
              {/* jadwal */}
              <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5 flex-col justify-start items-start">
                <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
                  {/* head */}
                  <thead>
                    <tr className="h-12 bg-base-200 text-xs">
                      <th>#</th>
                      <th>Jatuh Tempo</th>
                      <th>Tagihan</th>
                      <th>Status</th>
                      <th>Dibayar</th>
                      <th>Sisa</th>
                      {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
                        <th>Aksi</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingDataInstallments ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index}>
                          <td colSpan={6}>
                            <div className="skeleton h-12 w-full py-1" />
                          </td>
                        </tr>
                      ))
                    ) : isExistDataInstallments ? (
                      dataInstallments?.data?.installments?.map((item, _) => (
                        <tr
                          key={item.id}
                          className={cn(
                            "transition-all duration-75 ease-in-out h-12 text-base-content text-[0.7rem]",
                            // false === true && "bg-base-200",
                          )}
                        >
                          <td>
                            <span className="font-medium">
                              {item.cicilanKe}
                            </span>
                          </td>
                          <td>
                            {item.status !== INSTALLMENT_STATUS_TYPE.PAID ? (
                              <div className="flex flex-col justify-start items-start gap-1">
                                <span className="font-medium">
                                  {formatTanggalLengkap(item.jatuhTempo)}
                                </span>
                                <span
                                  className={cn(
                                    "text-[0.625rem] font-medium",
                                    getJatuhTempoTextColor(item.jatuhTempo),
                                  )}
                                >
                                  {getJatuhTempoText(item.jatuhTempo)}
                                </span>
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td>
                            <span className="font-medium">
                              {formatRupiah(item.nominal)}
                            </span>
                          </td>
                          <td>
                            <StatusInstallment status={item.status} />
                          </td>
                          <td>
                            <span className="text-success font-medium">
                              {formatRupiah(item.diBayar)}
                            </span>
                          </td>
                          <td>
                            <span className="font-medium text-error">
                              {formatRupiah(item.nominal - item.diBayar)}
                            </span>
                          </td>
                          {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
                            <td>
                              {item.status !== INSTALLMENT_STATUS_TYPE.PAID ? (
                                <button
                                  type="button"
                                  className="text-[0.625rem] font-medium px-2 py-1 border border-emerald-600 rounded-md flex flex-row justify-start items-center gap-1 group hover:text-primary-white transition-all duration-150 ease-in-out hover:bg-emerald-600"
                                  onClick={() => setDataPembayaran(item)}
                                >
                                  <CreditCard className="size-3" />

                                  <span>Bayar</span>
                                </button>
                              ) : (
                                <div className="flex flex-row justify-start items-center gap-1">
                                  <CircleCheck className="size-3 text-emerald-600" />
                                  <span className="text-emerald-600 text-[0.625rem] font-medium">
                                    Lunas
                                  </span>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>
                          <div className="w-full h-full flex flex-col justify-center items-center">
                            <DataEmpty
                              iconData={CalendarDays}
                              title="Jadwal Cicilan Tidak Tersedia"
                              description="Belum ada jadwal cicilan yang dapat ditampilkan saat ini."
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="w-full flex flex-row justify-end items-end p-2.5 border-t border-base-content/10">
                  {/* button */}
                  <SideBarRiwayatPembayaranTempo
                    jumlahCicilan={dataInstallments?.data?.jumlahCicilan ?? 0}
                    paymentTransactions={
                      dataInstallments?.data?.paymentTransactions
                    }
                  />
                </div>
              </div>

              {/* peringatan */}
              {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
                <div className="w-full">
                  <AlertLabelList
                    message={[
                      "Periksa jadwal jatuh tempo setiap angsuran agar pembayaran dapat dilakukan tepat waktu.",
                      "Pilih cicilan yang ingin dibayar, kemudian masukkan nominal pembayaran dan metode pembayaran pada panel di sebelah kanan.",
                      "Setiap pembayaran akan otomatis memperbarui status cicilan, sisa tagihan, dan riwayat pembayaran transaksi.",
                      "Pastikan nominal pembayaran tidak melebihi sisa tagihan pada cicilan yang dipilih untuk menjaga data tetap akurat.",
                    ]}
                  />
                </div>
              )}
            </div>

            {/* pembayaran */}
            {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
              <CardPembayaran
                tempoId={validatedId ?? null}
                dataPembayaran={dataPembayaran}
                jumlahCicilan={dataInstallments?.data?.jumlahCicilan}
                handleResetDataPembayaran={handleResetDataPembayaran}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <NotCompatible />
        </div>
      )}
    </div>
  );
};

export default InstallmentsDetail;
