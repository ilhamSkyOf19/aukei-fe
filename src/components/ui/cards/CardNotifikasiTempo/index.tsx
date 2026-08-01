import {
  Banknote,
  CalendarClock,
  ChevronRight,
  ClockAlert,
  CreditCard,
  Dot,
  Eye,
} from "lucide-react";
import { type FC } from "react";
import { formatTanggalPanjang } from "../../../../helpers/formatDate";
import {
  formatRupiah,
  getJatuhTempoText,
  getStatusDueToday,
} from "../../../../helpers/helpers";
import StatusTransaction from "../../StatusTransaction";
import type { INotifikasiTempo } from "../../../../models/notifikasiTempo.model";
import { INSTALLMENT_STATUS_TYPE } from "../../../../types/constant.type";
import { cn } from "../../../../utils/cn";
import ButtonWithIcon from "../../button/ButtonWithIcon";

type Props = {
  data: INotifikasiTempo;
  handleRedirectTempoDetail: (params: {
    tempoId: number;
    pelangganId: number;
  }) => void;
  large?: boolean;
};
const CardNotifikasiTempo: FC<Props> = ({
  handleRedirectTempoDetail,
  data: { cicilanKe, jatuhTempo, nominal, pelanggan, status, tempoId },
  large,
}) => {
  return (
    <div
      className={cn(
        "w-full border border-base-content/10 rounded-2xl md:rounded-xl flex flex-row justify-between items-center p-0 duration-150 ease-in-out bg-base-100",
        large
          ? "shadow-xs hover:bg-custom-primary/30 hover:border-custom-secondary"
          : "hover:bg-base-300",
      )}
    >
      {large ? (
        <div className="w-full h-full p-2.5 flex flex-row justify-between items-center gap-2.5">
          <div className="flex-6 flex flex-row justify-start items-center gap-4">
            {/* icon */}
            <div className="w-11 h-11 rounded-full bg-rose-50 flex flex-col justify-center items-center">
              <ClockAlert className="text-rose-500 size-4" />
            </div>

            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col justify-start items-start gap-0.5">
                {/* nama pelanggan */}
                <span className="text-[0.7rem] font-semibold text-base-content">
                  {pelanggan.nama}
                </span>

                {/* status */}
                <div className="flex flex-row justify-start items-start gap-1.5">
                  <StatusTransaction
                    {...(status === INSTALLMENT_STATUS_TYPE.OVERDUE && {
                      statusTempo: status,
                    })}
                    statusTempoDueToday={getStatusDueToday({
                      status,
                      jatuhTempo,
                    })}
                  />

                  <Dot className="text-base-content/50 size-4" />

                  <span className="text-[0.625rem] font-medium text-base-content">
                    {getJatuhTempoText(jatuhTempo, undefined, true)}
                  </span>
                </div>
              </div>

              <div className="w-fll flex flex-row justify-start items-center gap-6">
                <div className="flex flex-row mt-2.5  justify-start items-center gap-1.5">
                  <Banknote className="size-4 text-base-content/70" />
                  <span className="text-[0.625rem] font-medium text-base-content/70">
                    {formatRupiah(nominal)}
                  </span>
                </div>
                <div className="flex flex-row mt-2.5  justify-start items-center gap-1.5">
                  <CreditCard className="size-4 text-base-content/70" />
                  <span className="text-[0.625rem] font-medium text-base-content/70">
                    Cicilan ke {cicilanKe}
                  </span>
                </div>

                {/* tanggal */}
                <div className="flex flex-row mt-2.5  justify-start items-center gap-1.5">
                  <CalendarClock className="size-4 text-base-content/70" />
                  <span className="text-[0.625rem] font-medium text-base-content/70">
                    {formatTanggalPanjang(jatuhTempo)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-row justify-end items-center">
            <ButtonWithIcon
              icon={Eye}
              label="Lihat Detail"
              handleBtn={() =>
                handleRedirectTempoDetail({
                  pelangganId: pelanggan.id,
                  tempoId,
                })
              }
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="w-full h-full p-2.5 flex flex-row justify-between items-center gap-2.5"
          onClick={() => {
            handleRedirectTempoDetail({ tempoId, pelangganId: pelanggan.id });
          }}
        >
          <div className="w-full flex flex-row justify-start items-center gap-4">
            {/* icon */}
            <div className="w-11 h-11 rounded-full bg-rose-50 flex flex-col justify-center items-center">
              <ClockAlert className="text-rose-500 size-4" />
            </div>

            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col justify-start items-start gap-0.5">
                {/* nama pelanggan */}
                <span className="text-[0.7rem] font-semibold text-base-content">
                  {pelanggan.nama}
                </span>

                {/* status */}
                <div className="flex flex-row justify-start items-start gap-1.5">
                  <StatusTransaction
                    {...(status === INSTALLMENT_STATUS_TYPE.OVERDUE && {
                      statusTempo: status,
                    })}
                    statusTempoDueToday={getStatusDueToday({
                      status,
                      jatuhTempo,
                    })}
                  />

                  <Dot className="text-base-content/50 size-4" />

                  <span className="text-[0.625rem] font-medium text-base-content">
                    {getJatuhTempoText(jatuhTempo, undefined, true)}
                  </span>
                </div>
              </div>

              <div className="w-fll flex flex-row justify-start items-center gap-6">
                <div className="flex flex-row mt-2.5  justify-start items-center gap-1.5">
                  <Banknote className="size-4 text-base-content/70" />
                  <span className="text-[0.625rem] font-medium text-base-content/70">
                    {formatRupiah(nominal)}
                  </span>
                </div>
                <div className="flex flex-row mt-2.5  justify-start items-center gap-1.5">
                  <CreditCard className="size-4 text-base-content/70" />
                  <span className="text-[0.625rem] font-medium text-base-content/70">
                    Cicilan ke {cicilanKe}
                  </span>
                </div>

                {/* tanggal */}
                <div className="flex flex-row mt-2.5  justify-start items-center gap-1.5">
                  <CalendarClock className="size-4 text-base-content/70" />
                  <span className="text-[0.625rem] font-medium text-base-content/70">
                    {formatTanggalPanjang(jatuhTempo)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-start items-center">
            <ChevronRight className="size-5 text-base-content" />
          </div>
        </button>
      )}
    </div>
  );
};

export default CardNotifikasiTempo;
