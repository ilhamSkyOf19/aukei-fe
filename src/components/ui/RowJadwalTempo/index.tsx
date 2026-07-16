import { CalendarDaysIcon, CircleDollarSign, Trash2 } from "lucide-react";
import { formatRupiah } from "../../../helpers/helpers";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import { cn } from "../../../utils/cn";
import type { FC } from "react";
import type { CreateInstallmentType } from "../../../models/tempoInstallment.model";

type Props = {
  aksi?: boolean;
  dataTempo: CreateInstallmentType[];
  maxHeight?: string;
};
const RowJadwaTempo: FC<Props> = ({ aksi, dataTempo, maxHeight }) => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      {/* title */}
      <h3 className="text-xs font-medium text-base-content">
        Jadwal Cicilan Tempo
      </h3>

      <div className="w-full flex flex-col justify-start items-start border overflow-hidden border-base-content/10 rounded-xl">
        {/* header */}
        <div className="w-full grid grid-cols-10 gap-2 px-4 py-3 bg-gray-200 sticky top-0 z-10">
          {/* number */}
          <div className="col-span-1 flex flex-row justify-start items-center">
            <span className="text-xs font-semibold text-base-content/80">
              No
            </span>
          </div>

          <div className="col-span-4 flex flex-row justify-start items-center gap-4">
            <span className="text-xs font-semibold text-base-content/80">
              Tanggal Jatuh Tempo
            </span>
          </div>

          {/* nominal */}
          <div
            className={cn(
              "flex flex-row  items-center gap-2",
              aksi ? "col-span-3 justify-start" : "col-span-5 justify-end",
            )}
          >
            <span className="text-xs font-semibold text-base-content/80">
              Nominal
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
            "w-full flex flex-col justify-start items-start overflow-y-auto scrollbar-thumb-custom-secondary",
            maxHeight ? maxHeight : "max-h-60 ",
          )}
        >
          {dataTempo?.length > 0 ? (
            dataTempo.map((item) => (
              <Rows
                key={item.cicilanKe}
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
                Silahkan pilih jumlah cicilan dan tenor
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
};
const Rows: FC<RowsType> = ({
  nominal,
  number,
  jatuhTempo,
  lastIndex,
  aksi,
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
      <div className="col-span-4 flex flex-row justify-start items-center gap-2.5">
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
          "flex flex-row  items-center gap-2",
          aksi ? "col-span-3 justify-start" : "col-span-5 justify-end",
        )}
      >
        {/* icon */}
        <CircleDollarSign className="size-4 text-success" />
        <span className="text-xs font-semibold text-base-content">
          {formatRupiah(nominal)}
        </span>
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
