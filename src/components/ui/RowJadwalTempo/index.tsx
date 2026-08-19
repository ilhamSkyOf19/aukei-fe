import {
  CalendarDaysIcon,
  CircleDollarSign,
  Download,
  HandCoins,
  Printer,
  Trash2,
  WalletIcon,
} from "lucide-react";
import { formatRupiah, getStatusDueToday } from "../../../helpers/helpers";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import { cn } from "../../../utils/cn";
import type { FC } from "react";
import type { ITempoInstallmentType } from "../../../models/tempoInstallment.model";
import {
  TEMPO_STATUS_TYPE,
  type InstallmentStatusType,
} from "../../../types/constant.type";
import StatusInstallment from "../StatusInstallment";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonWithIcon from "../button/ButtonWithIcon";
import useRowJadwal from "./useRowJadwal";
import DataEmpty from "../../messages/DataEmpty";
import CardData from "../cards/CardData";
import LoadingFetch from "../LoadingFetch";
import ButtonCetakTable from "../button/ButtonCetakTable";
import ButtonDownloadTable from "../button/ButtonDownloadTable";

type Props = {
  aksi?: boolean;
  dataTempo?: Array<
    Pick<
      ITempoInstallmentType,
      "nominal" | "jatuhTempo" | "status" | "cicilanKe"
    > & { id?: number }
  >;
  maxHeight?: string;
  customEmptyMessage?: string;
  handleCustomTanggal?: () => void;
  startDateWatch?: string;
  pelangganId?: number;
  tempoId?: number;
  transactionId?: number;
  nomorTransaksi?: string;
  withInvoice?: boolean;
  isLoading?: boolean;
  noAksi?: boolean;

  handleSetToast?: (value: string) => void;
  handleSetAlert?: (value: string) => void;
};
const RowJadwaTempo: FC<Props> = ({
  aksi,
  dataTempo,
  maxHeight,
  customEmptyMessage,
  handleCustomTanggal,
  startDateWatch,
  pelangganId,
  tempoId,
  transactionId,
  withInvoice,
  isLoading,
  nomorTransaksi,
  noAksi,
  handleSetAlert,
  handleSetToast,
}) => {
  const {
    handleDownloadInvoiceKreditPdf,
    isLoadingDownloadInvoiceKreditPdf,
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,

    handlePrintInvoiceKredit,
    isLoadingPrintInvoiceKredit,
    handlePrintTempoPayment,
    isLoadingPrintTempoPayment,
  } = useRowJadwal({
    handleSetAlert,
    handleSetToast,
  });

  const currentPathname = useLocation().pathname;
  const navigate = useNavigate();

  const layout = (() => {
    if (!aksi && !withInvoice) {
      return {
        status: "col-span-4",
        action: "",
        invoice: "",
      };
    }

    if (aksi && !withInvoice) {
      return {
        status: "col-span-2",
        action: "col-span-2",
        invoice: "",
      };
    }

    if (!aksi && withInvoice) {
      return {
        status: "col-span-2",
        action: "",
        invoice: "col-span-2",
      };
    }

    return {
      status: "col-span-1",
      action: "col-span-1",
      invoice: "col-span-2",
    };
  })();

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      {/* title */}
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center gap-1.5">
          <h3 className="text-xs font-medium text-base-content">
            Jadwal Cicilan Tempo
          </h3>
          <span className="text-[0.7rem]">-</span>
          <span className="text-[0.7rem] text-base-content">
            Terhitung dari :{" "}
            <span className="font-medium">
              {formatTanggalPanjang(startDateWatch ?? new Date())}{" "}
            </span>
          </span>
        </div>

        {/* transaction detail */}
        {currentPathname.includes("transaksi") && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/dashboard/kredit/pelanggan/${pelangganId}/tempo/${tempoId}`,
              )
            }
            className="hidden md:flex flex-row justify-start items-center gap-1.5 hover:underline transition-all duration-150 ease-in-out"
          >
            <WalletIcon className="size-3.5 text-info" />
            <span className="text-[0.7rem] text-info">
              Lihat Detail Pembayaran
            </span>
          </button>
        )}

        {handleCustomTanggal && (
          <button
            type="button"
            onClick={() => handleCustomTanggal()}
            className="flex flex-row justify-start items-center gap-1.5 hover:underline transition-all duration-150 ease-in-out"
          >
            <CalendarDaysIcon className="size-3.5 text-info" />
            <span className="text-[0.7rem] text-info">Pilih Tanggal</span>
          </button>
        )}
      </div>
      {/* FOR SM */}
      <div className="w-full flex flex-col justify-start items-start gap-2.5 md:hidden">
        {isLoading ? (
          <LoadingFetch />
        ) : dataTempo && dataTempo.length > 0 ? (
          dataTempo?.map((item) => (
            <CardData
              key={item.id}
              statusTempo={item.status}
              titleTanggal={item.jatuhTempo}
              tagihan={item.nominal}
              statusAbsolute
              disabled
              tempoIcon
              withBg
              {...(item.id !== undefined && {
                downloadInvoiceKreditPaymentPdf: {
                  handleDownloadInvoiceKreditPaymentPdf: () =>
                    handleDownloadInvoiceKreditPaymentPdf({
                      id: item.id ?? 0,
                      cicilanKe: item.cicilanKe,
                    }),
                  isLoading: isLoadingDownloadInvoiceKreditPaymentPdf,
                },
              })}
              customHeight={"h-20"}
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
      {/* FOR MD & LG */}
      <div className="w-full flex-col justify-start items-start border overflow-hidden border-base-content/10 rounded-xl hidden md:flex">
        {/* header */}
        <div className="w-full grid grid-cols-10 gap-2 px-4 py-3 bg-gray-200 sticky top-0 z-10">
          <div className="col-span-1 flex items-center">
            <span className="text-xs font-semibold text-base-content/80">
              No
            </span>
          </div>

          <div className="col-span-3 flex items-center">
            <span className="text-xs font-semibold text-base-content/80">
              Tanggal Jatuh Tempo
            </span>
          </div>

          <div className="col-span-2 flex items-center">
            <span className="text-xs font-semibold text-base-content/80">
              Nominal
            </span>
          </div>

          <div
            className={cn("flex items-center justify-center", layout.status)}
          >
            <span className="text-xs font-semibold text-center text-base-content/80">
              Status
            </span>
          </div>

          {aksi && (
            <div className={cn("flex justify-end items-center", layout.action)}>
              <span className="text-xs font-semibold text-base-content/80">
                Aksi
              </span>
            </div>
          )}

          {withInvoice && (
            <div
              className={cn("flex justify-end items-center", layout.invoice)}
            >
              <span className="text-xs font-semibold text-base-content/80">
                Struk
              </span>
            </div>
          )}
        </div>

        {/* rows data */}
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start overflow-y-auto scrollbar-thin scrollbar-thumb-custom-secondary",
            maxHeight ? maxHeight : "max-h-60 ",
          )}
        >
          {dataTempo && dataTempo?.length > 0 ? (
            dataTempo.map((item) => (
              <Rows
                key={item.cicilanKe}
                status={item.status}
                number={item.cicilanKe}
                nominal={item.nominal}
                jatuhTempo={item.jatuhTempo}
                lastIndex={item.cicilanKe === dataTempo.length}
                aksi={aksi}
                {...(item.id !== undefined && {
                  invoice: {
                    handlePrintTempoPayment: () =>
                      handlePrintTempoPayment({
                        installmentId: item.id ?? 0,
                      }),
                    isLoading: isLoadingPrintTempoPayment,
                  },
                })}
                layout={layout}
                {...(!noAksi && {
                  downloadInvoiceKreditPaymentPdf: {
                    handleDownloadInvoiceKreditPaymentPdf: () =>
                      handleDownloadInvoiceKreditPaymentPdf({
                        id: item.id ?? 0,
                        cicilanKe: item.cicilanKe,
                      }),
                    isLoading: isLoadingDownloadInvoiceKreditPaymentPdf,
                  },
                })}
              />
            ))
          ) : (
            <div className="col-span-10 flex flex-row w-full justify-center items-center py-12 px-4">
              <span className="text-xs text-base-content/50">
                {customEmptyMessage ??
                  "Silahkan pilih jumlah cicilan dan tenor"}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* button print */}
      {transactionId && (
        <div className="w-full flex flex-row justify-end items-end gap-2.5 mt-2.5">
          <div className="w-auto block md:hidden">
            <ButtonWithIcon
              icon={WalletIcon}
              bgColor={"bg-info"}
              textColor="text-primary-white"
              label="Lihat Pembayaran"
              handleBtn={() =>
                navigate(
                  `/dashboard/kredit/pelanggan/${pelangganId}/tempo/${tempoId}`,
                )
              }
            />
          </div>

          <div className="flex flex-row justify-start items-start gap-2.5">
            <ButtonWithIcon
              icon={Printer}
              label="Cetak Struk Kredit"
              bgColor={"bg-info"}
              textColor="text-primary-white"
              isLoading={isLoadingPrintInvoiceKredit}
              handleBtn={() =>
                handlePrintInvoiceKredit({
                  id: transactionId,
                })
              }
              classHidden="hidden lg:flex"
            />

            <ButtonWithIcon
              icon={Download}
              label="Download Struk Kredit"
              bgColor="bg-gray-400"
              textColor="text-primary-white"
              isLoading={isLoadingDownloadInvoiceKreditPdf}
              handleBtn={() =>
                handleDownloadInvoiceKreditPdf({
                  id: transactionId,
                  nomorTransaksi: nomorTransaksi ?? "",
                })
              }
              classHidden="hidden lg:flex"
            />
          </div>

          <ButtonWithIcon
            icon={Download}
            bgColor="bg-gray-400"
            textColor="text-primary-white"
            label="Download Struk Kredit"
            isLoading={isLoadingDownloadInvoiceKreditPdf}
            handleBtn={() =>
              handleDownloadInvoiceKreditPdf({
                id: transactionId,
                nomorTransaksi: nomorTransaksi ?? "",
              })
            }
            classHidden="flex lg:hidden"
          />
        </div>
      )}
    </div>
  );
};

type RowsType = {
  number: number;
  jatuhTempo: Date;
  nominal: number;
  lastIndex?: boolean;
  aksi?: boolean;
  status: InstallmentStatusType;
  invoice?: {
    handlePrintTempoPayment: () => Promise<void>;
    isLoading?: boolean;
  };
  layout: {
    status: string;
    action: string;
    invoice: string;
  };
  downloadInvoiceKreditPaymentPdf?: {
    handleDownloadInvoiceKreditPaymentPdf: () => Promise<void>;
    isLoading?: boolean;
  };
};
const Rows: FC<RowsType> = ({
  nominal,
  number,
  jatuhTempo,
  lastIndex,
  aksi,
  status,
  invoice,
  layout,
  downloadInvoiceKreditPaymentPdf,
}) => {
  return (
    <div
      className={cn(
        "w-full grid grid-cols-10 gap-2 px-4 py-3",
        !lastIndex && "border-b border-base-content/10",
      )}
    >
      {/* No */}
      <div className="col-span-1 flex items-center">
        <div className="w-6 h-6 rounded-full bg-custom-primary/50 flex justify-center items-center">
          <span className="text-custom-secondary text-[10px] font-medium">
            {number}
          </span>
        </div>
      </div>

      {/* Tanggal */}
      <div className="col-span-3 flex items-center gap-2">
        <CalendarDaysIcon className="size-4 text-warning" />

        <span className="text-xs font-medium">
          {formatTanggalPanjang(jatuhTempo)}
        </span>
      </div>

      {/* Nominal */}
      <div className="col-span-2 flex items-center gap-2">
        <CircleDollarSign className="size-4 text-success" />

        <span className="text-xs font-semibold">{formatRupiah(nominal)}</span>
      </div>

      {/* Status */}
      <div className={cn("flex justify-center items-center", layout.status)}>
        <StatusInstallment
          {...(getStatusDueToday({
            status,
            jatuhTempo,
          })
            ? { statusDueToday: true }
            : { status })}
        />
      </div>

      {/* Aksi */}
      {aksi && (
        <div className={cn("flex justify-end items-center", layout.action)}>
          <button type="button" className="group">
            <Trash2 className="size-4 text-base-content/50 group-hover:text-error transition-all" />
          </button>
        </div>
      )}

      {/* Struk */}
      {(invoice || downloadInvoiceKreditPaymentPdf) && (
        <div
          className={cn(
            "flex justify-end items-center gap-1.5 overflow-hidden",
            layout.invoice,
          )}
        >
          {/* BUAT FLAG PARTIAL */}
          {status !== TEMPO_STATUS_TYPE.UNPAID &&
          status !== TEMPO_STATUS_TYPE.OVERDUE ? (
            <>
              {invoice && (
                <ButtonCetakTable
                  isLoading={invoice.isLoading}
                  handleCetak={() => invoice.handlePrintTempoPayment()}
                  classHidden="hidden lg:flex"
                />
              )}
              {downloadInvoiceKreditPaymentPdf && (
                <ButtonDownloadTable
                  handleDownload={() =>
                    downloadInvoiceKreditPaymentPdf.handleDownloadInvoiceKreditPaymentPdf()
                  }
                  isLoading={downloadInvoiceKreditPaymentPdf.isLoading}
                />
              )}
            </>
          ) : (
            <span>-</span>
          )}
        </div>
      )}
    </div>
  );
};
export default RowJadwaTempo;
