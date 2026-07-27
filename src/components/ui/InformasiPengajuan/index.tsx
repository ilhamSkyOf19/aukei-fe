import type { FC } from "react";
import type { IPenggunaInternalType } from "../../../models/penggunaInternal.model";
import { CalendarDays, History, UserRound } from "lucide-react";
import { cn } from "../../../utils/cn";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import SideBarRiwayatPengajuan from "../../SideBarRiwayatPengajuan";

type Props = {
  isLoading?: boolean;
  author: Pick<IPenggunaInternalType, "id" | "nama" | "isActive" | "username">;
  tanggalDiajukan?: Date | null;
};
const InformasiPengajuan: FC<Props> = ({
  author,
  isLoading,
  tanggalDiajukan,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl md:rounded-xl bg-base-100 shadow-xs border border-transparent dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6",
      )}
    >
      {/* title */}
      <div className="w-full flex flex-row justify-start items-center">
        <h2 className="text-base-content text-sm font-semibold">
          Informasi Pengajuan
        </h2>
      </div>

      {isLoading ? (
        <>
          <div className="w-full h-8 skeleton mt-4" />
          <div className="w-full h-8 skeleton mt-2" />
        </>
      ) : (
        <>
          <div className="w-full flex flex-row justify-between items-start gap-3 mt-8">
            {/* icon */}
            <div className="flex flex-row justify-center items-start">
              <UserRound className="size-5 text-blue-600" />
            </div>

            {/* label and value */}
            <div
              className={cn(
                "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
              )}
            >
              {/* label */}
              <span className="flex-1 text-xs text-base-content font-medium">
                Diajukan Oleh
              </span>

              {/* value */}
              <div className="flex-2 flex flex-row justify-end items-start">
                {/* di ajukan oleh */}
                <div className="w-full flex flex-row justify-end items-center gap-4">
                  {/* nama */}
                  <div className="px-4 flex flex-col justify-center items-start border-r border-base-content/10">
                    <span className={"text-xs font-medium text-base-content"}>
                      {author.nama}
                    </span>
                  </div>
                  {/* status active */}
                  <div className="flex flex-row justify-start items-center">
                    <div
                      className={cn(
                        "px-2 py-0.5 flex-row rounded-full flex justify-center items-center",
                        author.isActive ? "bg-emerald-100" : "bg-rose-100",
                      )}
                    >
                      <span
                        className={cn(
                          "text-[0.625rem] font-medium uppercase",
                          author.isActive
                            ? "text-emerald-600"
                            : "text-rose-600",
                        )}
                      >
                        {author.isActive ? "aktif" : "tidak aktif"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* tanggal di ajukan */}
          <div className="w-full flex flex-row justify-between items-start gap-3 mt-8">
            {/* icon */}
            <div className="h-full flex flex-row justify-start items-start">
              <CalendarDays className="size-5 text-emerald-600" />
            </div>

            {/* label and value */}
            <div
              className={cn(
                "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
              )}
            >
              {/* label */}
              <span className="text-xs text-base-content font-medium">
                Tanggal Diajukan
              </span>

              {/* value */}
              <div className="flex flex-row justify-end items-center">
                {tanggalDiajukan ? (
                  <span className={"text-xs font-medium text-base-content"}>
                    {formatTanggalLengkap(tanggalDiajukan)} WIB
                  </span>
                ) : (
                  <span className={"text-xs italic text-base-content/50"}>
                    Belum Diajukan
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* riwayat */}
          <div className="w-full flex flex-row justify-between items-start mt-6 gap-3">
            {/* icon */}
            <div className="h-full flex flex-row justify-start items-start mt-2">
              <History className="size-5 text-emerald-600" />
            </div>

            {/* label and value */}
            <div
              className={cn(
                "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
              )}
            >
              {/* label */}
              <span className="text-xs text-base-content font-medium">
                Riwayat Pengajuan
              </span>

              {/* value */}
              <div className="flex flex-row justify-end items-center">
                <SideBarRiwayatPengajuan />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InformasiPengajuan;
