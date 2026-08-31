import { Check, Download, Printer, Send, Trash2, X } from "lucide-react";
import type { FC } from "react";

import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import Alert from "../../../components/messages/Alert";
import Toast from "../../../components/messages/Toast";
import ModalDelete from "../../../components/modals/ModalDelete";
import NotCompatible from "../../../components/messages/NotCompatible";
import ModalAlert from "../../../components/modals/ModalAlert";

import {
  ROLE_INTERNAL_TYPE,
  STATUS_STOCK_OPNAME_TYPE,
} from "../../../types/constant.type";

import { ALERT_CONFIG_STOCK_OPNAME_DETAIL } from "../../../types/alert.types";

import { TOAST_CONFIG_STOCK_OPNAME_DETAIL } from "../../../types/toast.type";

import { formatTanggalLengkap } from "../../../helpers/formatDate";
import { cn } from "../../../utils/cn";

import useStockOpnameDetail from "./useStockOpnameDetail";

import StatusStockOpname from "../../../components/ui/StatusStockOpname";
import InformasiStockOpnameDetail from "./InformasiStockOpnameDetail";
import FormulirTambahProdukStockOpnameDetail from "./FormulirTambahProdukStockOpnameDetail";
import ShowStockOpname from "./ShowStockOpnameDetail";
import ModalFormulirVerifikasiOrPengajuanStockOpname from "../../../components/modals/ModalFormulirVerifikasiOrPengajuanStockOpname";
import { subtractMinutes } from "../../../helpers/helpers";
import CountDown from "../../../components/ui/CountDown";

type Props = {
  fromPengajuan?: boolean;
};

const StockOpnameDetail: FC<Props> = ({ fromPengajuan }) => {
  const {
    // DATA
    dataStockOpnameDetail,
    pengguna,

    // LOADING
    isLoadingStockOpnameDetail,

    // STATUS
    isStatusDraft,
    isStatusPending,
    isStatusRejected,
    isStatusApproved,

    // PERMISSION
    isCanManageDetail,
    isCanAjukan,
    isCanVerifikasi,

    // ALERT
    alert,
    handleSetAlert,

    // TOAST
    toast,
    handleSetToast,

    // CONFIRM
    modalKonfirmasiRef,
    handleConfirm,
    handleCancel,
    dataConfirm,

    // PENGAJUAN / PENOLAKAN
    modalFormulirRef,
    handleCloseModalFormulir,
    idModalFormulir,
    dataModalFormulir,
    handleAjukan,
    handleTolak,

    // VERIFIKASI
    handleSetuju,
    isPendingSetuju,

    // DELETE DETAIL
    modalDeleteRef,
    handleCloseModalDelete,
    handleDelete,
    dataDelete,
    isPendingDelete,

    // OTHER
    handleBack,

    handlePosting,
    isPendingPosting,

    isExpired,

    dataDeleteStockOpname,
    handleCloseModalDeleteStockOpname,
    handleDeleteStockOpname,
    handleShowModalDeleteStockOpname,
    isPendingDeleteStockOpname,
    modalDeleteStockOpnameRef,

    handleCancelPosting,

    handleCancelVerifikasi,
    isPendingCancelPosting,
    isPendingCancelVerifikasi,
  } = useStockOpnameDetail({
    fromPengajuan,
  });

  const stockOpname = dataStockOpnameDetail?.data;

  const isKasir = pengguna?.role === ROLE_INTERNAL_TYPE.KASIR;

  const canShowFormTambahBarang = isCanManageDetail;

  return (
    <main className="w-full">
      <div
        className={cn(
          "flex w-full flex-col justify-start items-start gap-2.5 p-2.5",
        )}
      >
        {/* ============================================================
ALERT
============================================================ */}

        {alert && (
          <Alert
            alert={alert.id !== null}
            isAnimationOut={alert.isAnimationOut || false}
            label={ALERT_CONFIG_STOCK_OPNAME_DETAIL[alert.type].message}
          />
        )}

        {/* ============================================================
        TOAST
    ============================================================ */}

        {toast && (
          <Toast
            toast={toast.id !== null}
            isAnimationOut={toast.isAnimationOut || false}
            label={TOAST_CONFIG_STOCK_OPNAME_DETAIL[toast.type].message}
            color={TOAST_CONFIG_STOCK_OPNAME_DETAIL[toast.type].color}
          />
        )}

        {/* ============================================================
        HEADER
    ============================================================ */}

        <div
          className={cn(
            "bg-base-100 rounded-2xl md:rounded-xl",
            "shadow-sm border border-transparent",
            "dark:border-base-content/10",
            "w-full flex flex-col justify-start p-2 lg:p-4",
          )}
        >
          {/* BUTTON BACK */}

          <div className="w-30">
            <ButtonBackText label="Kembali" handleClick={handleBack} />
          </div>

          {isLoadingStockOpnameDetail ? (
            <>
              <div className="w-80 h-8 skeleton mt-4" />

              <div className="w-50 h-4 skeleton mt-2" />
            </>
          ) : (
            <div
              className={cn(
                "w-full flex flex-col lg:flex-row",
                "justify-start items-start lg:items-end",
              )}
            >
              {/* INFORMASI */}

              <div
                className={cn(
                  "flex flex-col justify-start items-start",
                  "lg:flex-3",
                )}
              >
                <div
                  className={cn(
                    "w-full px-2 flex flex-row",
                    "justify-start items-start gap-2 mt-4",
                  )}
                >
                  <h2
                    className={cn(
                      "text-base-content",
                      "text-lg lg:text-xl",
                      "font-semibold",
                    )}
                  >
                    {stockOpname?.kodeReferensi}
                  </h2>

                  <StatusStockOpname
                    status={
                      stockOpname?.status ?? STATUS_STOCK_OPNAME_TYPE.DRAFT
                    }
                  />
                </div>

                <div
                  className={cn(
                    "px-2 mt-2 flex flex-row",
                    "justify-start items-center gap-2",
                  )}
                >
                  <p className="text-xs text-base-content">
                    Dibuat pada tanggal{" "}
                    <span className="font-medium">
                      {formatTanggalLengkap(
                        stockOpname?.createdAt ?? new Date(),
                      )}
                    </span>
                  </p>
                  {isStatusApproved &&
                    pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
                      <div className="hidden lg:flex flex-row justify-start items-center gap-2">
                        <div className="status status-success status-sm" />

                        <span className="text-xs text-base-content">
                          {isExpired
                            ? "Anda tidak dapat membatalkan postingan karena sudah melewati batas waktu"
                            : `Anda dapat membatalkan postingan sebelum waktu habis : `}
                        </span>
                        {!isExpired && (
                          <CountDown
                            expiredAt={subtractMinutes(
                              dataStockOpnameDetail?.data?.verifiedAt ??
                                new Date(),
                              1,
                            )}
                          />
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* ACTION */}

              <div
                className={cn(
                  "w-full lg:flex-1",
                  "flex flex-col lg:flex-row",
                  "justify-start items-start",
                  "lg:items-center lg:justify-end",
                  "gap-3 px-2 lg:px-0",
                  "pb-2 lg:pb-0",
                )}
              >
                <div
                  className={cn(
                    "w-full lg:w-auto",
                    "flex flex-row",
                    "justify-start items-start",
                    "gap-2 mt-6 lg:mt-0",
                  )}
                >
                  {/* CETAK / DOWNLOAD */}

                  {isStatusApproved && (
                    <div
                      className={cn(
                        "flex flex-row",
                        "justify-start items-start",
                        "gap-2.5",
                      )}
                    >
                      <ButtonWithIcon
                        textColor="text-primary-white"
                        label="Cetak"
                        icon={Printer}
                        bgColor="bg-info"
                        isLoading={false}
                        handleBtn={() => {}}
                        classHidden="hidden lg:flex"
                      />

                      <ButtonWithIcon
                        label="Download"
                        icon={Download}
                        bgColor="bg-gray-400"
                        textColor="text-primary-white"
                        isLoading={false}
                        handleBtn={() => {}}
                      />
                    </div>
                  )}

                  {/* VERIFIKASI */}

                  {isCanVerifikasi &&
                    isStatusPending &&
                    pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
                      <>
                        <ButtonWithIcon
                          textColor="text-primary-white"
                          label="Tolak"
                          icon={X}
                          bgColor="bg-error"
                          handleBtn={handleTolak}
                        />

                        <ButtonWithIcon
                          textColor="text-primary-white"
                          label="Setuju"
                          icon={Check}
                          bgColor="bg-success"
                          isLoading={isPendingSetuju}
                          handleBtn={handleSetuju}
                        />
                      </>
                    )}

                  {/* HAPUS */}

                  {isCanManageDetail &&
                    (isStatusDraft || isStatusRejected) &&
                    dataStockOpnameDetail?.data?.adminOpname?.id ===
                      pengguna?.id && (
                      <>
                        <ButtonWithIcon
                          textColor="text-primary-white"
                          label="Hapus"
                          icon={Trash2}
                          bgColor="bg-error"
                          isLoading={isPendingDelete}
                          handleBtn={() =>
                            handleShowModalDeleteStockOpname(stockOpname?.id, {
                              kodeReferensi: stockOpname?.kodeReferensi,
                            })
                          }
                        />

                        {isStatusDraft &&
                          pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
                            <ButtonWithIcon
                              disabled={isPendingPosting}
                              label="Posting"
                              icon={Check}
                              handleBtn={() =>
                                handlePosting(dataStockOpnameDetail?.data?.id)
                              }
                            />
                          )}
                      </>
                    )}
                </div>

                {isStatusApproved &&
                  !isExpired &&
                  pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
                  (dataStockOpnameDetail?.data?.adminOpname?.id ===
                  pengguna?.id ? (
                    <ButtonWithIcon
                      label="Batalkan Posting"
                      icon={Check}
                      isLoading={isPendingCancelPosting}
                      handleBtn={() =>
                        handleCancelPosting(dataStockOpnameDetail?.data?.id)
                      }
                    />
                  ) : (
                    <ButtonWithIcon
                      label="Batalkan Verifikasi"
                      icon={Check}
                      isLoading={isPendingCancelVerifikasi}
                      handleBtn={() =>
                        handleCancelVerifikasi(dataStockOpnameDetail?.data?.id)
                      }
                    />
                  ))}

                {/* AJUKAN */}

                {isCanAjukan && (
                  <div
                    className={cn(
                      "w-full lg:w-auto",
                      "flex flex-col",
                      "justify-start items-start",
                      "gap-2",
                    )}
                  >
                    <ButtonWithIcon
                      handleBtn={handleAjukan}
                      icon={Send}
                      bgColor="bg-custom-primary"
                      textColor="text-custom-secondary"
                      label="Ajukan Sekarang"
                      customWidth="w-full lg:w-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
        INFORMASI STOCK OPNAME
    ============================================================ */}

        <InformasiStockOpnameDetail
          author={stockOpname?.adminOpname}
          tanggalDiajukan={
            stockOpname?.status === STATUS_STOCK_OPNAME_TYPE.PENDING ||
            stockOpname?.status === STATUS_STOCK_OPNAME_TYPE.REJECTED ||
            stockOpname?.status === STATUS_STOCK_OPNAME_TYPE.APPROVED
              ? stockOpname?.riwayat?.[1]?.createdAt
              : stockOpname?.riwayat?.[0]?.createdAt
          }
          isUpdate={isCanManageDetail}
          handleSetToast={handleSetToast}
          totalProduk={stockOpname?.details?.length ?? 0}
          idStockOpnameDetail={stockOpname?.id}
          isLoadingStocOpnameDetail={isLoadingStockOpnameDetail}
          keterangan={stockOpname?.keterangan ?? ""}
          status={stockOpname?.status}
          tanggal={stockOpname?.tanggalOpname}
        />

        {/* ============================================================
        FORM TAMBAH PRODUK
    ============================================================ */}

        {canShowFormTambahBarang && (
          <FormulirTambahProdukStockOpnameDetail
            handleSetToast={handleSetToast}
            handleSetAlert={handleSetAlert}
            alert={alert}
          />
        )}

        {/* ============================================================
        DATA PRODUK
    ============================================================ */}

        <ShowStockOpname
          dataStockOpnameDetail={dataStockOpnameDetail}
          isCanUpdate={isCanManageDetail}
          isLoadingStockOpnameDetail={isLoadingStockOpnameDetail}
          handleSetToast={handleSetToast}
        />

        {/* ============================================================
        MODAL CONFIRM SETUJU
    ============================================================ */}

        <ModalAlert
          modalRef={modalKonfirmasiRef}
          handleCloseModal={handleCancel}
          handleConfirm={handleConfirm}
          bigTitle={dataConfirm?.bigTitle ?? ""}
          smallTitle={dataConfirm?.smallTitle ?? ""}
          isLoading={isPendingSetuju}
          icon={Check}
          iconColor="text-success"
        />

        {/* ============================================================
        MODAL PENGAJUAN / PENOLAKAN
    ============================================================ */}

        <ModalFormulirVerifikasiOrPengajuanStockOpname
          modalRef={modalFormulirRef}
          handleCloseModal={handleCloseModalFormulir}
          stockOpnameId={idModalFormulir ?? 0}
          kodeReferensi={stockOpname?.kodeReferensi ?? ""}
          type={dataModalFormulir?.type}
          role={pengguna?.role}
          handleSetAlert={handleSetAlert}
        />

        {/* ============================================================
        MODAL DELETE DETAIL
    ============================================================ */}

        <ModalDelete
          modalRef={modalDeleteRef}
          handleCloseModal={handleCloseModalDelete}
          handleDelete={handleDelete}
          bigTitle={
            "Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?"
          }
          highlightData={dataDelete?.kodeReferensi}
          isLoadingDelete={isPendingDelete}
        />

        <ModalDelete
          modalRef={modalDeleteStockOpnameRef}
          handleCloseModal={handleCloseModalDeleteStockOpname}
          handleDelete={handleDeleteStockOpname}
          bigTitle={
            "Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?"
          }
          highlightData={dataDeleteStockOpname?.kodeReferensi}
          isLoadingDelete={isPendingDeleteStockOpname}
        />
      </div>

      {/* ============================================================
      NOT COMPATIBLE
  ============================================================ */}

      {isKasir && (
        <div className={cn("w-full h-[80vh]", "flex items-center lg:hidden")}>
          <NotCompatible />
        </div>
      )}
    </main>
  );
};

export default StockOpnameDetail;
