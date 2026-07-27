import { Eye } from "lucide-react";
import { cn } from "../../utils/cn";
import { STATUS_INVENTORI_TYPE } from "../../types/constant.type";
import {
  StatusDraft,
  StatusPending,
  StatusPosted,
  StatusRejected,
} from "../StatusRiwayatPengajuan";
import { formatTanggalPanjang } from "../../helpers/formatDate";
import useSideBarRiwayatPengajuan from "./useSideBarRiwayatPengajuan";
import { statusStyle } from "../../types/statusStyle";
import PaginationAndLimit from "../filters/PaginationAndLimit";
import useContentSideBar from "../../hooks/useContentSideBar";

const SideBarRiwayatPengajuan = () => {
  // call use
  const {
    dataRiwayat,
    isExistDataRiwayat,
    isLoadingRiwayat,
    setPage,
    isBarangMasuk,
  } = useSideBarRiwayatPengajuan();

  const { drawerRef, handleClose, handleOpen } = useContentSideBar();

  return (
    <div className="drawer drawer-end">
      <input
        ref={drawerRef}
        id="my-drawer-5"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content">
        {/* Page content here */}
        <button
          type="button"
          onClick={handleOpen}
          className="drawer-button h-10 md:h-10.5 rounded-xl bg-custom-primary shadow-xs flex flex-row justify-start items-center gap-2 px-3 hover-overlay"
        >
          <Eye className="size-4 text-custom-secondary" />
          <span className="text-xs font-medium text-custom-secondary">
            Lihat
          </span>
        </button>
      </div>

      {/* drawer side */}
      <div className="drawer-side z-30">
        <label
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={handleClose}
        />
        <div className="menu bg-base-100 h-screen w-70 md:w-120 overflow-hidden">
          <div className="w-full h-full flex flex-col justify-start items-start p-2.5">
            {isLoadingRiwayat ? (
              <div className="w-full flex flex-col justify-start items-start">
                {/* title skeleton */}
                <div className="w-full border-b border-base-content/50 pb-4">
                  <div className="w-1/2 h-8 rounded-full skeleton" />
                </div>

                {/* card skeleton */}
                <div className="w-full flex flex-col justify-start items-end gap-4 mt-8">
                  <div className="skeleton w-95 h-20 rounded-lg" />
                  <div className="skeleton w-95 h-20 rounded-lg" />
                  <div className="skeleton w-95 h-20 rounded-lg" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-full flex-1 flex flex-col justify-start items-start pb-4 mb-2 gap-1">
                  <h1 className="text-base font-semibold text-base-content">
                    Riwayat Pengajuan{" "}
                    {isBarangMasuk ? "Barang Masuk" : "Barang Keluar"}
                  </h1>

                  <span className="text-xs text-base-content/50">
                    Berikut adalah riwayat perubahan dan status dari pengajuan
                    ini.
                  </span>
                </div>

                <div className="w-full flex-12 scrollbar-thumb-custom-secondary overflow-y-auto flex flex-col justify-start items-start">
                  {/* is loading */}
                  {isLoadingRiwayat ? (
                    <div className="w-full flex flex-row justify-center items-center">
                      <span className="text-base-content/60 text-xs ">
                        Riwayat Tidak Tersedia
                      </span>
                    </div>
                  ) : isExistDataRiwayat ? (
                    dataRiwayat?.data?.data.map((item, index) => {
                      const style = statusStyle[item.status];
                      const isLast =
                        index === (dataRiwayat?.data?.data?.length || 0) - 1;

                      return (
                        <div
                          key={item.id}
                          className="relative grid grid-cols-[36px_1fr] gap-1.5 mb-2.5 w-full"
                        >
                          {/* Timeline */}
                          <div className="relative flex justify-center">
                            {!isLast && (
                              <div className="absolute top-7 h-[89%] -bottom-6 left-1/2 w-px -translate-x-1/2 bg-base-content/20" />
                            )}

                            {/* dot */}
                            <div
                              className={cn(
                                "mt-1 h-6 w-6 md:h-6 md:w-6 rounded-full border relative flex flex-row justify-center items-center",
                                style.borderDot,
                              )}
                            >
                              <div
                                className={cn(
                                  "w-2.5 h-2.5 md:w-2.5 md:h-2.5 rounded-full bg-amber-600",
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
                                <div className="w-full flex flex-row justify-between items-start md:items-center">
                                  <div className="flex flex-col md:flex-row  justify-start items-start md:items-center gap-2.5">
                                    <span className="text-xs text-base-content font-medium pr-2.5 md:border-r md:border-base-content/10">
                                      {item.author.nama}
                                    </span>
                                    {/* status */}
                                    <div className="flex flex-row justify-start items-center">
                                      {item.status ===
                                        STATUS_INVENTORI_TYPE.POSTED && (
                                        <StatusPosted size="xs" />
                                      )}
                                      {item.status ===
                                        STATUS_INVENTORI_TYPE.REJECTED && (
                                        <StatusRejected size="xs" />
                                      )}
                                      {item.status ===
                                        STATUS_INVENTORI_TYPE.DRAFT && (
                                        <StatusDraft size="xs" />
                                      )}
                                      {item.status ===
                                        STATUS_INVENTORI_TYPE.PENDING && (
                                        <StatusPending size="xs" />
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-[0.625rem] font-medium text-base-content">
                                    {formatTanggalPanjang(item.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={cn(
                                "w-full mt-2.5 flex flex-col justify-start items-start gap-0.5 border-base-content/10",
                              )}
                            >
                              {/* label */}
                              <span className="text-[0.7rem] font-medium text-base-content">
                                Keterangan
                              </span>

                              <p className="text-[0.625rem] text-base-content">
                                {item.keterangan}
                              </p>
                            </div>
                          </article>
                        </div>
                      );
                    })
                  ) : (
                    <div></div>
                  )}
                </div>

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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarRiwayatPengajuan;
