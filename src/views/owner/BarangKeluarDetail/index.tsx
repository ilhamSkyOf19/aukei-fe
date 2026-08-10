import { AlertTriangle, Check, Printer, Send, Trash2, X } from "lucide-react";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import StatusInventori from "../../../components/ui/StatusInventori";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
} from "../../../types/constant.type";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import Alert from "../../../components/messages/Alert";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_BARANG_KELUAR_DETAIL } from "../../../types/toast.type";
import ModalAlert from "../../../components/modals/ModalAlert";
import ModalDelete from "../../../components/modals/ModalDelete";
import useBarangKeluarDetail from "./useBarangKeluarDetail";
import ShowDataBarangKeluar from "./ShowDataBarangKeluar";
import InformasiBarangKeluar from "./InformasiBarangKeluar";
import FormulirTambahBarangKeluar from "./FormulirTambahBarangKeluar";
import { expireDateOneDay, subtractMinutes } from "../../../helpers/helpers";
import type { FC } from "react";
import CountDown from "../../../components/ui/CountDown";
import ModalFormulirVerifikasiOrPengajuan from "../../../components/modals/ModalFormulirVerifikasiOrPengajuan";
import { ALERT_CONFIG_BARANG_KELUAR_DETAIL } from "../../../types/alert.types";

type Props = {
  fromPengajuanBarang?: boolean;
};

const BarangKeluarDetail: FC<Props> = ({ fromPengajuanBarang }) => {
  // call use barang keluar detail
  const {
    dataBarangKeluarDetail,
    isLoadingBarangKeluarDetail,

    alert,
    toast,
    handlePosting,
    isPendingPosting,
    handleCancelPosting,
    handleConfirmPosting,
    modalKonfirmasiPostingRef,
    handleCancelConfirmPosting,
    isPendingCancelPosting,
    isStatusDraft,
    isStatusPosted,
    isExpired,

    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    isPendingDelete,
    handleShowModalDelete,
    modalDeleteRef,
    handleSetToast,
    handleSetAlert,
    dataConfirm,
    handleCancelVerifikasi,
    handleSetuju,
    isPendingCancelVerifikasi,
    isPendingVerifikasiPengajuanBarang,
    pengguna,
    canShowFormTambahBarang,
    isStatusRejected,
    modalFormulirVerifikasiOrPengajuan,
    handleShowModalFormulirVerifikasiOrPengajuan,
    handleCloseModalFormulirVerifikasiOrPengajuan,
    idModalFormulirVerifikasiOrPengajuan,
    dataModalFormulirVerifikasiOrPengajuan,
    isCanUpdate,
    isCanBatalkanPosting,
    handleBack,
    fromPengajuanBarangNotifikasi,
  } = useBarangKeluarDetail({ fromPengajuanBarang });

  return (
    <main className="w-full flex flex-col justify-start items-start gap-2.5 p-2.5">
      {/* alert */}
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_BARANG_KELUAR_DETAIL[alert.type].message}
        />
      )}

      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_BARANG_KELUAR_DETAIL[toast.type].message}
          color={TOAST_CONFIG_BARANG_KELUAR_DETAIL[toast.type].color}
        />
      )}

      {/* header */}
      <div className="rounded-2xl md:rounded-xl bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-2 lg:p-4">
        {/* button back */}
        <div className="w-30">
          <ButtonBackText label="Kembali" handleClick={() => handleBack()} />
        </div>

        {isLoadingBarangKeluarDetail ? (
          <>
            <div className="w-80 h-8 skeleton mt-4" />
            <div className="w-50 h-4 skeleton mt-2" />
            <div className="w-30 h-7 skeleton mt-2" />
            <div className="w-full h-7 skeleton mt-2" />
          </>
        ) : (
          <div className="w-full flex flex-col lg:flex-row justify-start items-start lg:items-center">
            {/* kode and status */}
            <div className="flex lg:flex-3 flex-col justify-start items-start">
              <div className="w-full px-2 flex flex-row justify-start items-start gap-2 mt-4">
                <h2 className="text-base-content text-lg lg:text-xl font-semibold">
                  {dataBarangKeluarDetail?.data?.kodeReferensi}
                </h2>

                {/* status */}
                <StatusInventori
                  status={
                    dataBarangKeluarDetail?.data?.status ??
                    STATUS_INVENTORI_TYPE.DRAFT
                  }
                />
              </div>

              {/* tanggal */}
              <div className="px-2 mt-2 flex flex-row justify-start items-center gap-2">
                <p className="text-xs text-base-content">
                  Dibuat pada tanggal{" "}
                  <span className="font-medium">
                    {formatTanggalLengkap(
                      dataBarangKeluarDetail?.data?.createdAt ?? new Date(),
                    )}
                  </span>
                </p>

                {/* caption */}
                {isStatusPosted &&
                  !dataBarangKeluarDetail?.data?.kodeReferensi.includes(
                    "RT",
                  ) && (
                    <div className="hidden lg:flex flex-row justify-start items-center gap-2">
                      <div className="status status-success status-sm" />

                      <span className="text-xs text-base-content">
                        {isExpired
                          ? pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
                            "Anda tidak dapat membatalkan postingan karena sudah melewati batas waktu"
                          : pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                            ? `Anda dapat membatalkan postingan sebelum waktu habis : `
                            : "Status masih dapat berubah sebelum waktu habis :"}
                      </span>
                      {!isExpired && (
                        <CountDown
                          expiredAt={subtractMinutes(
                            dataBarangKeluarDetail?.data?.postedAt ??
                              new Date(),
                            1,
                          )}
                        />
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col lg:flex-row justify-start items-start lg:items-center lg:justify-end gap-3 px-2 lg:px-0 pb-2 lg:pb-0">
              {/* button */}
              <div className="w-full lg:w-auto flex flex-row justify-start items-start gap-2  mt-6 lg:mt-0">
                {dataBarangKeluarDetail?.data?.status ===
                  STATUS_INVENTORI_TYPE.POSTED && (
                  <ButtonWithIcon
                    textColor="text-primary-white"
                    label="Cetak"
                    icon={Printer}
                    bgColor="bg-info"
                  />
                )}

                {/* button verifikasi */}
                {(fromPengajuanBarang || fromPengajuanBarangNotifikasi) &&
                  pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
                  dataBarangKeluarDetail?.data?.status ===
                    STATUS_INVENTORI_TYPE.PENDING && (
                    <>
                      {/* tolak */}
                      <ButtonWithIcon
                        textColor="text-primary-white"
                        label="Tolak"
                        icon={X}
                        bgColor="bg-error"
                        handleBtn={() =>
                          handleShowModalFormulirVerifikasiOrPengajuan(
                            dataBarangKeluarDetail?.data?.id,
                            {
                              type: "tolak",
                            },
                          )
                        }
                      />

                      {/* setuju */}
                      <ButtonWithIcon
                        textColor="text-primary-white"
                        label="Setuju"
                        icon={Check}
                        bgColor="bg-success"
                        isLoading={isPendingVerifikasiPengajuanBarang}
                        handleBtn={() => handleSetuju()}
                      />
                    </>
                  )}

                {/* button trash */}
                {(dataBarangKeluarDetail?.data?.status ===
                  STATUS_INVENTORI_TYPE.DRAFT ||
                  (fromPengajuanBarang &&
                    dataBarangKeluarDetail?.data?.status !==
                      STATUS_INVENTORI_TYPE.POSTED &&
                    dataBarangKeluarDetail?.data?.status !==
                      STATUS_INVENTORI_TYPE.PENDING &&
                    pengguna?.role === ROLE_INTERNAL_TYPE.KASIR)) && (
                  <ButtonWithIcon
                    textColor="text-primary-white"
                    label="Hapus"
                    icon={Trash2}
                    bgColor="bg-error"
                    handleBtn={() =>
                      handleShowModalDelete(dataBarangKeluarDetail?.data?.id, {
                        kodeReferensi:
                          dataBarangKeluarDetail?.data?.kodeReferensi,
                      })
                    }
                  />
                )}
              </div>

              {/* button posting */}
              {(isCanUpdate || isCanBatalkanPosting) && (
                <div className="flex flex-col justify-start items-start w-full lg:w-auto gap-2 lg:gap-0">
                  <ButtonWithIcon
                    handleBtn={() => {
                      if (isStatusDraft || isStatusRejected) {
                        if (pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) {
                          handlePosting(dataBarangKeluarDetail?.data?.id);
                        } else {
                          handleShowModalFormulirVerifikasiOrPengajuan(
                            dataBarangKeluarDetail?.data?.id,
                            { type: "pengajuan" },
                          );
                        }
                      } else if (isStatusPosted) {
                        if (fromPengajuanBarang) {
                          handleCancelVerifikasi(
                            dataBarangKeluarDetail?.data?.id,
                          );
                        } else
                          handleCancelPosting(
                            dataBarangKeluarDetail?.data?.id ?? 0,
                          );
                      }
                    }}
                    icon={
                      pengguna?.role === ROLE_INTERNAL_TYPE.KASIR ? Send : Check
                    }
                    bgColor={
                      isStatusDraft || isStatusRejected
                        ? "bg-custom-primary"
                        : "bg-error"
                    }
                    textColor={
                      isStatusDraft || isStatusRejected
                        ? "text-custom-secondary"
                        : "text-primary-white"
                    }
                    label={
                      isStatusPosted
                        ? "Batalkan Posting"
                        : isStatusDraft || isStatusRejected
                          ? pengguna?.role === ROLE_INTERNAL_TYPE.KASIR
                            ? "Ajukan Sekarang"
                            : "Posting Sekarang"
                          : ""
                    }
                    customWidth="w-full lg:w-auto"
                    isLoading={
                      isPendingCancelPosting ||
                      isPendingPosting ||
                      isPendingCancelVerifikasi
                    }
                  />

                  {/* caption */}
                  {/* buat count down */}
                  {isStatusPosted && (
                    <span className="text-[0.635rem] lg:hidden text-base-content/50">
                      {`Anda dapat membatalkan postingan sebelum ${formatTanggalLengkap(
                        expireDateOneDay(
                          dataBarangKeluarDetail?.data?.createdAt ?? new Date(),
                        ),
                      )}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* informasi tanggal dan keterangan */}
      <InformasiBarangKeluar
        isLoadingBarangKeluarDetail={isLoadingBarangKeluarDetail}
        totalBarangKeluar={
          dataBarangKeluarDetail?.data?.detailBarangKeluars?.length ?? 0
        }
        tanggalKeluar={dataBarangKeluarDetail?.data?.tanggalKeluar}
        keterangan={dataBarangKeluarDetail?.data?.keterangan ?? undefined}
        totalNilai={dataBarangKeluarDetail?.data?.totalNilai ?? undefined}
        idBarangKeluarDetail={dataBarangKeluarDetail?.data?.id}
        handleSetToast={handleSetToast}
        jenisKeluar={dataBarangKeluarDetail?.data?.jenisKeluar}
        status={dataBarangKeluarDetail?.data?.status}
        author={dataBarangKeluarDetail?.data?.author}
        tanggalDiajukan={
          dataBarangKeluarDetail?.data?.tanggalDiajukan ?? undefined
        }
        isUpdate={isCanUpdate}
      />

      {/* formulir */}
      {canShowFormTambahBarang && (
        <FormulirTambahBarangKeluar
          totalBarang={
            dataBarangKeluarDetail?.data?.detailBarangKeluars?.length ?? 0
          }
          handleSetToast={handleSetToast}
          handleSetAlert={handleSetAlert}
        />
      )}

      {/* show data */}
      <ShowDataBarangKeluar
        isLoadingBarangKeluarDetail={isLoadingBarangKeluarDetail}
        dataBarangKeluarDetail={dataBarangKeluarDetail}
        fromPengajuanBarang={fromPengajuanBarang}
        role={pengguna?.role}
        handleSetAlert={handleSetAlert}
      />

      {/* modal konfirmasi */}
      <ModalAlert
        modalRef={modalKonfirmasiPostingRef}
        handleCloseModal={handleCancelConfirmPosting}
        handleConfirm={handleConfirmPosting}
        bigTitle={dataConfirm?.bigTitle ?? ""}
        smallTitle={dataConfirm?.smallTitle ?? ""}
        isLoading={isPendingPosting || isPendingCancelPosting}
        icon={AlertTriangle}
        iconColor="text-warning"
      />

      {/* modal pengajuan */}
      {(fromPengajuanBarang || fromPengajuanBarangNotifikasi) && (
        <ModalFormulirVerifikasiOrPengajuan
          modalRef={modalFormulirVerifikasiOrPengajuan}
          handleCloseModal={handleCloseModalFormulirVerifikasiOrPengajuan}
          barangKeluarId={idModalFormulirVerifikasiOrPengajuan}
          kodeReferensi={dataBarangKeluarDetail?.data?.kodeReferensi ?? ""}
          type={dataModalFormulirVerifikasiOrPengajuan?.type}
          role={pengguna?.role}
          handleSetAlert={handleSetAlert}
        />
      )}

      {/* modal delete */}
      {fromPengajuanBarang && (
        <ModalDelete
          modalRef={modalDeleteRef}
          handleCloseModal={handleCloseModalDelete}
          handleDelete={handleDelete}
          bigTitle={`Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?`}
          highlightData={dataDelete?.kodeReferensi}
          isLoadingDelete={isPendingDelete}
        />
      )}
    </main>
  );
};

export default BarangKeluarDetail;
