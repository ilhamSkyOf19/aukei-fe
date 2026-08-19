import {
  CalendarDays,
  CircleCheck,
  Clock,
  CreditCard,
  Download,
  HandCoins,
  ListOrdered,
  Printer,
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
  getStatusDueToday,
  getWeekFromPeriod,
  isReminderNeeded,
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
import CardData from "../../../components/ui/cards/CardData";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import LoadingFetch from "../../../components/ui/LoadingFetch";
import ButtonCetakTable from "../../../components/ui/button/ButtonCetakTable";
import ButtonDownloadTable from "../../../components/ui/button/ButtonDownloadTable";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_INSTALLMENT_DETAIL } from "../../../types/toast.type";
import Alert from "../../../components/messages/Alert";
import { ALERT_CONFIG_INSTALLMENT_DETAIL } from "../../../types/alert.types";
import ButtonSendMessageTable from "../../../components/ui/button/ButtonSendMessageTable";
import { kirimWA } from "../../../utils/sendMessage";

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
    handleDownloadInvoiceKreditPdf,
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPdf,
    variables,

    alert,
    toast,
    handlePrintInvoiceKredit,
    handlePrintTempoPayment,
    isLoadingPrintInvoiceKredit,
    isLoadingPrintTempoPayment,
  } = useInstallmentsDetail();

  return (
    <div className="w-full">
      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          color={TOAST_CONFIG_INSTALLMENT_DETAIL[toast.type].color}
          label={TOAST_CONFIG_INSTALLMENT_DETAIL[toast.type].message}
          isAnimationOut={toast?.isAnimationOut || false}
        />
      )}

      {/* alert */}
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_INSTALLMENT_DETAIL[alert.type].message}
        />
      )}

      {(windowSize === "lg" && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR) ||
      pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? (
        <div className="w-full px-2.5 pt-2.5 flex flex-col justify-start items-start">
          <ButtonBackText
            handleClick={() =>
              navigate(currentPathname.split("/").slice(0, -2).join("/"))
            }
          />
          {/* statistik */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5 mt-2.5">
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* pelanggan */}
              <div
                className={cn(
                  "col-span-2 md:col-span-1 relative flex flex-row justify-start items-center gap-4 border p-2 rounded-2xl md:rounded-xl border-base-content/10",
                  isLoadingDataInstallments && "skeleton h-24",
                )}
              >
                {!isLoadingDataInstallments && (
                  <>
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

                      <div className="flex flex-row gap-1 justify-start items-center mt-1.5">
                        <span className="text-[0.625rem] font-medium text-base-content/70">
                          Informasi pelanggan
                        </span>
                      </div>
                    </div>
                  </>
                )}
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
                customColSpan="col-span-2 md:col-span-1"
              />
              <CardStatistik
                icon={{
                  icon: ReceiptText,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                label="Total Transaksi"
                value={formatRupiah(
                  (dataInstallments?.data?.totalTagihan ?? 0) +
                    (dataInstallments?.data?.uangMuka ?? 0),
                )}
                caption="Total nilai transaksi."
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
                caption="Total tagihan keseluruhan."
                isLoading={isLoadingDataInstallments}
                withAlert="Total tagihan setelah DP"
              />
              <CardStatistik
                icon={{
                  icon: ReceiptText,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                label="Total Tagihan"
                value={formatRupiah(dataInstallments?.data?.totalTagihan ?? 0)}
                caption="Total tagihan keseluruhan."
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
                caption="Total uang muka yang dibayarkan."
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
                isLoading={isLoadingDataInstallments}
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
                isLoading={isLoadingDataInstallments}
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
                isLoading={isLoadingDataInstallments}
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
                isLoading={isLoadingDataInstallments}
              />
            </div>
          </div>

          {/* DATA SM */}
          <div className="w-full mt-2.5 flex flex-col justify-start items-start gap-2.5 md:hidden">
            {/* title */}
            <h3 className="w-full text-center my-2.5 font-medium text-lg">
              Jadwal Cicilan
            </h3>
            {isLoadingDataInstallments ? (
              <LoadingFetch />
            ) : isExistDataInstallments ? (
              dataInstallments?.data?.installments.map((item) => (
                <CardData
                  key={item.id}
                  statusTempo={item.status}
                  titleTanggal={item.jatuhTempo}
                  tagihan={item.nominal}
                  diBayar={item.diBayar}
                  sisa={item.nominal - item.diBayar}
                  statusAbsolute
                  disabled
                  tempoIcon
                  withBg
                  downloadInvoiceKreditPaymentPdf={{
                    handleDownloadInvoiceKreditPaymentPdf: () =>
                      handleDownloadInvoiceKreditPaymentPdf({
                        id: item.id ?? 0,
                        cicilanKe: item.cicilanKe,
                      }),
                    isLoading: isLoadingDownloadInvoiceKreditPaymentPdf,
                  }}
                  {...(isReminderNeeded({
                    tanggalJatuhTempo: item.jatuhTempo,
                  }) <= 3 && {
                    handleSendMessage: () =>
                      kirimWA({
                        nama: dataInstallments?.data?.pelanggan.nama ?? "",
                        noWa: dataInstallments?.data?.pelanggan.noWa ?? "",
                        nominal: item.nominal,
                        status: item.status,
                        tglJatuhTempo: item.jatuhTempo,
                      }),
                  })}
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
            {/* button riwayat pembayaran */}
            <SideBarRiwayatPembayaranTempo
              jumlahCicilan={dataInstallments?.data?.jumlahCicilan ?? 0}
              paymentTransactions={dataInstallments?.data?.paymentTransactions}
              customBtnWidth="w-full"
            />
            <ButtonWithIcon
              icon={Download}
              bgColor="bg-gray-400"
              textColor="text-primary-white"
              label="Download Struk Kredit"
              handleBtn={() =>
                handleDownloadInvoiceKreditPdf({
                  id: dataInstallments?.data?.transactionId ?? 0,
                  nomorTransaksi: dataInstallments?.data?.nomorTransaksi ?? "",
                })
              }
              customWidth="w-full"
              classHidden="flex md:hidden"
            />
          </div>

          {/* for lg */}
          <div className="w-full flex flex-row justify-between items-start gap-2.5">
            {/* informasi installment */}
            <div className="flex-2 flex flex-col justify-start items-start gap-2.5">
              {/* jadwal */}
              <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden md:flex mt-2.5 flex-col justify-start items-start">
                <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
                  {/* head */}
                  <thead>
                    <tr className="h-12 bg-base-200 text-xs">
                      <th>#</th>
                      <th>Jatuh Tempo</th>
                      <th>Tagihan</th>
                      <th>Dibayar</th>
                      <th>Sisa</th>
                      <th>Status</th>
                      <th className="text-center">Aksi</th>
                      <th className="text-center">Pesan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingDataInstallments ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index}>
                          <td colSpan={7}>
                            <div className="skeleton h-12 w-full py-1" />
                          </td>
                        </tr>
                      ))
                    ) : isExistDataInstallments ? (
                      dataInstallments?.data?.installments?.map((item, _) => {
                        const selisihDate = isReminderNeeded({
                          tanggalJatuhTempo: item.jatuhTempo,
                        });
                        return (
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
                              <div className="flex flex-col justify-start items-start gap-1">
                                <span className="font-medium">
                                  {formatTanggalLengkap(item.jatuhTempo)}
                                </span>
                                <span
                                  className={cn(
                                    "text-[0.625rem] font-medium",
                                    getJatuhTempoTextColor(
                                      item.jatuhTempo,
                                      item.tanggalLunas,
                                    ),
                                  )}
                                >
                                  {getJatuhTempoText(
                                    item.jatuhTempo,
                                    item.tanggalLunas,
                                  )}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="font-medium">
                                {formatRupiah(item.nominal)}
                              </span>
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
                            <td>
                              <StatusInstallment
                                {...(getStatusDueToday({
                                  status: item.status,
                                  jatuhTempo: item.jatuhTempo,
                                })
                                  ? { statusDueToday: true }
                                  : { status: item.status })}
                              />
                            </td>

                            <td>
                              <div className="flex w-full flex-col justify-start items-center gap-1.5">
                                {item.status !== INSTALLMENT_STATUS_TYPE.PAID &&
                                  (pengguna?.role ===
                                  ROLE_INTERNAL_TYPE.KASIR ? (
                                    <button
                                      type="button"
                                      className="text-[0.625rem] font-medium px-2 py-1 border border-emerald-600 rounded-md flex flex-row justify-start items-center gap-1 group hover:text-primary-white transition-all duration-150 ease-in-out hover:bg-emerald-600"
                                      onClick={() => setDataPembayaran(item)}
                                    >
                                      <CreditCard className="size-3" />

                                      <span>Bayar</span>
                                    </button>
                                  ) : item.status ===
                                      INSTALLMENT_STATUS_TYPE.PARTIAL &&
                                    pengguna?.role ===
                                      ROLE_INTERNAL_TYPE.OWNER ? null : (
                                    <span>-</span>
                                  ))}{" "}
                                {(item.status ===
                                  INSTALLMENT_STATUS_TYPE.PAID ||
                                  item.status ===
                                    INSTALLMENT_STATUS_TYPE.PARTIAL) && (
                                  <div className="flex flex-row justify-center items-center gap-1.5">
                                    {/* button cetak */}
                                    <ButtonCetakTable
                                      tooltipPosition="left"
                                      isLoading={isLoadingPrintTempoPayment}
                                      handleCetak={() =>
                                        handlePrintTempoPayment({
                                          installmentId: item.id,
                                        })
                                      }
                                      classHidden="hidden lg:flex"
                                    />

                                    {/* buttonw download */}
                                    <ButtonDownloadTable
                                      tooltipPosition="left"
                                      isLoading={
                                        isLoadingDownloadInvoiceKreditPaymentPdf &&
                                        variables?.id === item.id
                                      }
                                      handleDownload={() =>
                                        handleDownloadInvoiceKreditPaymentPdf({
                                          id: item.id,
                                          cicilanKe: item.cicilanKe,
                                        })
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </td>

                            <td align="center">
                              <ButtonSendMessageTable
                                tooltipPosition="left"
                                disabled={selisihDate > 3}
                                handleSend={() =>
                                  kirimWA({
                                    nama:
                                      dataInstallments?.data?.pelanggan?.nama ??
                                      "",
                                    noWa:
                                      dataInstallments?.data?.pelanggan?.noWa ??
                                      "",
                                    nominal: item.nominal,
                                    status: item.status,
                                    tglJatuhTempo: item.jatuhTempo,
                                  })
                                }
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            pengguna?.role === ROLE_INTERNAL_TYPE.KASIR ? 7 : 6
                          }
                        >
                          <div className="w-full h-full flex flex-col justify-center items-center">
                            <DataEmpty
                              iconData={CalendarDays}
                              title="Jadwal Cicilan Tidak Tersedia"
                              description="Belum ada jadwal cicilan yang dapat ditampilkan saat ini."
                              xs
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="w-full flex-row justify-end items-end p-2.5 border-t border-base-content/10 hidden md:flex">
                  {dataInstallments?.data?.transactionId && (
                    <div className="w-full flex flex-row justify-start items-start gap-2.5">
                      <ButtonWithIcon
                        icon={Printer}
                        bgColor="bg-info"
                        textColor="text-primary-white"
                        label="Cetak Struk Kredit"
                        isLoading={isLoadingPrintInvoiceKredit}
                        handleBtn={() =>
                          handlePrintInvoiceKredit({
                            id: dataInstallments?.data?.transactionId ?? 0,
                          })
                        }
                        classHidden="hidden lg:flex"
                      />

                      <ButtonWithIcon
                        icon={Download}
                        bgColor="bg-gray-400"
                        textColor="text-primary-white"
                        label="Download Struk Kredit"
                        isLoading={isLoadingDownloadInvoiceKreditPdf}
                        handleBtn={() =>
                          handleDownloadInvoiceKreditPdf({
                            id: dataInstallments?.data?.transactionId ?? 0,
                            nomorTransaksi:
                              dataInstallments?.data?.nomorTransaksi ?? "",
                          })
                        }
                      />
                    </div>
                  )}

                  {/* button */}
                  <SideBarRiwayatPembayaranTempo
                    jumlahCicilan={dataInstallments?.data?.jumlahCicilan ?? 0}
                    paymentTransactions={
                      dataInstallments?.data?.paymentTransactions
                    }
                    classHidden="w-full md:block"
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
