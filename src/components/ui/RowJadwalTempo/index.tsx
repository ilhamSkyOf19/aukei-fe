import {
  CalendarDaysIcon,
  CircleDollarSign,
  CreditCard,
  Printer,
  Trash2,
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
import { InvoiceServices } from "../../../services/invoice.service";
import useRowJadwal from "./useRowJadwal";

type Props = {
  aksi?: boolean;
  dataTempo?: Pick<
    ITempoInstallmentType,
    "nominal" | "jatuhTempo" | "status" | "id" | "cicilanKe"
  >[];
  maxHeight?: string;
  customEmptyMessage?: string;
  handleCustomTanggal?: () => void;
  startDateWatch?: string;
  pelangganId?: number;
  tempoId?: number;
  transactionId?: number;
  withInvoice?: boolean;
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
}) => {
  const {
    handlePrintAll,
    handlePrintSelected,
    handleSelectTempoPayment,
    selectedTempoPaymentIds,
  } = useRowJadwal();

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
            className="flex flex-row justify-start items-center gap-1.5 hover:underline transition-all duration-150 ease-in-out"
          >
            <CreditCard className="size-3.5 text-info" />
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

      <div className="w-full flex flex-col justify-start items-start border overflow-hidden border-base-content/10 rounded-xl">
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
                invoice={() => handlePrintAll({ tempoPaymentId: item.id })}
                layout={layout}
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
        <div className="w-full flex flex-row justify-end items-end">
          <ButtonWithIcon
            icon={Printer}
            label="Cetak Struk Kredit"
            handleBtn={() =>
              InvoiceServices.printInvoiceKredit({ id: transactionId })
            }
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
  invoice?: () => void;
  layout: {
    status: string;
    action: string;
    invoice: string;
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
      {invoice && (
        <div className={cn("flex justify-end items-center", layout.invoice)}>
          {/* BUAT FLAG PARTIAL */}
          {status !== TEMPO_STATUS_TYPE.UNPAID ? (
            <button
              type="button"
              className="text-[0.625rem] font-medium px-2 py-1 border border-emerald-600 rounded-md flex flex-row justify-start items-center gap-1 group hover:text-primary-white transition-all duration-150 ease-in-out hover:bg-emerald-600"
              onClick={() => invoice()}
            >
              <Printer className="size-3" />

              <span>Cetak</span>
            </button>
          ) : (
            <span>-</span>
          )}
        </div>
      )}
    </div>
  );
};
export default RowJadwaTempo;
