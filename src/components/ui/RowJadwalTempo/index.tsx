import {
  CalendarDaysIcon,
  CircleDollarSign,
  CreditCard,
  Trash2,
} from "lucide-react";
import { formatRupiah, getStatusDueToday } from "../../../helpers/helpers";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import { cn } from "../../../utils/cn";
import type { FC } from "react";
import type { CreateInstallmentType } from "../../../models/tempoInstallment.model";
import {
  INSTALLMENT_STATUS_TYPE,
  type InstallmentStatusType,
} from "../../../types/constant.type";
import StatusInstallment from "../StatusInstallment";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  aksi?: boolean;
  dataTempo?: CreateInstallmentType[];
  maxHeight?: string;
  customEmptyMessage?: string;
  handleCustomTanggal?: () => void;
  startDateWatch?: string;
  pelangganId?: number;
  tempoId?: number;
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
}) => {
  const currentPathname = useLocation().pathname;
  const navigate = useNavigate();

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
          {/* number */}
          <div className="col-span-1 flex flex-row justify-start items-center">
            <span className="text-xs font-semibold text-base-content/80">
              No
            </span>
          </div>

          <div className="col-span-3 flex flex-row justify-start items-center gap-4">
            <span className="text-xs font-semibold text-base-content/80">
              Tanggal Jatuh Tempo
            </span>
          </div>

          {/* nominal */}
          <div className={cn("flex flex-row items-center gap-2 col-span-2")}>
            <span className="text-xs font-semibold text-base-content/80">
              Nominal
            </span>
          </div>

          {/* status */}
          <div
            className={cn(
              "flex flex-row  justify-start items-center gap-2",
              aksi ? "col-span-2 justify-start" : "col-span-4 justify-end",
            )}
          >
            <span className="text-xs font-semibold text-base-content/80">
              Status
            </span>
          </div>

          {aksi && (
            <div className="col-span-2 flex flex-row justify-end items-center">
              <span className="text-xs font-semibold text-base-content/80">
                Aksi
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
};
const Rows: FC<RowsType> = ({
  nominal,
  number,
  jatuhTempo,
  lastIndex,
  aksi,
  status,
}) => {
  return (
    <div
      className={cn(
        "w-full grid grid-cols-10 gap-2 px-4 py-3",
        !lastIndex && "border-b border-base-content/10",
      )}
    >
      {/* number */}
      <div className="col-span-1 flex flex-row justify-start items-center">
        <div className="w-6 h-6 flex flex-row justify-center items-center rounded-full bg-custom-primary/50">
          <span className="text-custom-secondary text-[0.625rem] font-medium">
            {number}
          </span>
        </div>
      </div>

      {/* date */}
      <div className="col-span-3 flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        <CalendarDaysIcon className="size-4 text-warning" />

        {/* date */}
        <span className="text-xs font-medium text-base-content">
          {formatTanggalPanjang(jatuhTempo)}
        </span>
      </div>

      {/* nominal */}
      <div
        className={cn(
          "flex flex-row items-center gap-2 col-span-2 justify-start",
        )}
      >
        {/* icon */}
        <CircleDollarSign className="size-4 text-success shrink-0" />
        <span className="text-xs font-semibold text-base-content">
          {formatRupiah(nominal)}
        </span>
      </div>

      {/* nominal */}
      <div
        className={cn(
          "flex flex-row  items-center gap-2",
          aksi ? "col-span-2 justify-start" : "col-span-4 justify-end",
        )}
      >
        {/* status */}
        <StatusInstallment
          {...(getStatusDueToday({
            status,
            jatuhTempo,
          })
            ? { statusDueToday: true }
            : { status: status })}
        />
      </div>

      {aksi && (
        <div className="col-span-2 flex flex-row justify-end items-center">
          <button type="button" className="group">
            <Trash2 className="size-4 text-base-content/50 group-hover:text-error transition-all duration-150 ease-in-out" />
          </button>
        </div>
      )}
    </div>
  );
};
export default RowJadwaTempo;
