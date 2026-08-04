import { type FC } from "react";
import RowJadwaTempo from "../../../../components/ui/RowJadwalTempo";
import type { ResponseStructure } from "../../../../types/response.type";
import type { ResponseTransactionType } from "../../../../models/transaction.model";
import { cn } from "../../../../utils/cn";
import type { LucideIcon } from "lucide-react";
import { formatRupiah, getWeekFromPeriod } from "../../../../helpers/helpers";
import { TRANSACTION_STATUS_TYPE } from "../../../../types/constant.type";

type Props = {
  dataTransaction?: ResponseStructure<ResponseTransactionType | null>;
  isLoadingTransaction: boolean;
};
const RingkasanKredit: FC<Props> = ({
  dataTransaction,
  isLoadingTransaction,
}) => {
  return (
    <>
      {/* ringkasan kredit */}
      {dataTransaction?.data?.metodePembayaran === "TEMPO" && (
        <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
          {/* header */}
          <h3 className="text-base-content font-medium text-xs">
            Ringkasan Kredit
          </h3>
          <div className="w-full h-auto flex flex-col justify-evenly items-start pt-6">
            {/* header */}
            <div className="w-full flex flex-row justify-evenly items-start pb-4 border-b gap-2.5 border-base-content/10">
              {isLoadingTransaction ? (
                Array.from({ length: 4 }, (_, i) => i).map((item) => (
                  <div
                    key={item}
                    className="flex flex-row justify-start items-start w-full"
                  >
                    <div className="w-35 h-9 skeleton" />
                  </div>
                ))
              ) : (
                <>
                  <CardInformasiTransaksi
                    label="Periode"
                    value={`${dataTransaction?.data?.tempo?.periode ?? 0} Hari / ${getWeekFromPeriod(dataTransaction?.data?.tempo?.periode ?? 0)} Minggu`}
                    border
                  />

                  <CardInformasiTransaksi
                    label="Jumlah Cicilan"
                    value={`${dataTransaction?.data?.tempo?.jumlahCicilan ?? 0} Kali`}
                    border
                  />

                  <CardInformasiTransaksi
                    label="Tenor"
                    value={`${(dataTransaction?.data?.tempo?.periode ?? 0) * (dataTransaction?.data?.tempo?.jumlahCicilan ?? 0)} Hari / ${getWeekFromPeriod((dataTransaction?.data?.tempo?.periode ?? 0) * (dataTransaction?.data?.tempo?.jumlahCicilan ?? 0))} Minggu`}
                    border
                  />

                  <CardInformasiTransaksi
                    label="Sisa Tagihan"
                    value={`${formatRupiah(dataTransaction?.data?.tempo?.totalTagihan ?? 0)}`}
                    fontWeight="font-semibold"
                  />
                </>
              )}
            </div>

            {/* jadwal cicilan */}
            <div className="w-full mt-4">
              <RowJadwaTempo
                pelangganId={dataTransaction.data.pelanggan.id}
                tempoId={dataTransaction?.data?.tempo?.id}
                dataTempo={dataTransaction?.data?.tempo?.installments ?? []}
                maxHeight="max-h-80"
                customEmptyMessage={
                  dataTransaction?.data?.status ===
                  TRANSACTION_STATUS_TYPE.BOOKING
                    ? "Silahkan selesaikan booking untuk mengatur jadwal cicilan"
                    : undefined
                }
                transactionId={dataTransaction?.data?.id}
                withInvoice
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// card infomrasi transaksi
type CardInformasiTransaksiProps = {
  textColor?: string;
  icon?: {
    icon: LucideIcon;
    bgColor: string;
    textColor: string;
  };
  label: string;
  value: string;
  border?: boolean;
  fontWeight?: string;
};
const CardInformasiTransaksi: FC<CardInformasiTransaksiProps> = ({
  textColor,
  label,
  value,
  icon,
  border,
  fontWeight,
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start gap-1",
        border && "border-r border-base-content/10",
      )}
    >
      {/* label */}
      <span className="text-[0.7rem] text-base-content/70 font-medium">
        {label}
      </span>
      <div className="flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        {icon && (
          <div
            className={cn(
              "w-7 h-7 flex justify-center items-center rounded-md shrink-0",
              icon.bgColor,
            )}
          >
            <icon.icon className={cn("size-3.5", icon.textColor)} />
          </div>
        )}
        <span
          className={cn(
            "text-[0.7rem]",
            textColor ? textColor : "text-base-content",
            fontWeight ? fontWeight : "font-medium",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export default RingkasanKredit;
