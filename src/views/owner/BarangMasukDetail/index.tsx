import { AlertTriangle, Check, Printer, Send, Trash2, X } from "lucide-react";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import StatusInventori from "../../../components/ui/StatusInventori";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
} from "../../../types/constant.type";
import useBarangMasukDetail from "./useBarangMasukDetail";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import { expireDateOneDay, subtractMinutes } from "../../../helpers/helpers";
import ShowDataBarangMasuk from "./ShowBarangMasuk";
import Alert from "../../../components/messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/toast.type";
import ModalAlert from "../../../components/modals/ModalAlert";
import ModalDelete from "../../../components/modals/ModalDelete";
import InformasiBarangMasuk from "./InformasiBarangMasuk";
import FormulirTambahBarangMasuk from "./FormulirTambahBarangMasuk";
import CountDown from "../../../components/ui/CountDown";
import type { FC } from "react";
import ModalFormulirVerifikasiOrPengajuan from "../../../components/modals/ModalFormulirVerifikasiOrPengajuan";

type Props = {
  fromPengajuanBarang?: boolean;
};

const BarangMasukDetail: FC<Props> = ({ fromPengajuanBarang }) => {
  // call use barang masuk detail
  const {
    dataBarangMasukDetail,
    isLoadingBarangMasukDetail,

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
    isStatusRejected,
    isExpired,

    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    isPendingDelete,
    handleShowModalDelete,
    modalDeleteRef,
    handleSetToast,
    handleSetAlert,
    pengguna,
    handleSetuju,
    isPendingVerifikasiPengajuanBarang,
    dataConfirm,
    handleCancelVerifikasi,
    isPendingCancelVerifikasi,
    dataModalFormulirVerifikasiOrPengajuan,
    handleCloseModalFormulirVerifikasiOrPengajuan,
    handleShowModalFormulirVerifikasiOrPengajuan,
    modalFormulirVerifikasiOrPengajuan,
    canShowFormTambahBarang,
    idModalFormulirVerifikasiOrPengajuan,
    isCanUpdate,
    isCanBatalkanPosting,

    handleBack,
  } = useBarangMasukDetail({ fromPengajuanBarang });

  return (
    <main className="w-full flex flex-col justify-start items-start gap-2.5 p-2.5">
      {/* alert */}
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_BARANG_MASUK_DETAIL[alert.type].message}
        />
      )}

      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_BARANG_MASUK_DETAIL[toast.type].message}
          color={TOAST_CONFIG_BARANG_MASUK_DETAIL[toast.type].color}
        />
      )}

      {/* header */}
      <div className="bg-base-100 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10 w-full flex flex-col justify-start p-2 lg:p-4">
        {/* button back */}
        <div className="w-30">
          <ButtonBackText label="Kembali" handleClick={() => handleBack()} />
        </div>

        {isLoadingBarangMasukDetail ? (
          <>
            <div className="w-80 h-8 skeleton mt-4" />
            <div className="w-50 h-4 skeleton mt-2" />
            <div className="w-30 h-7 skeleton mt-2" />
            <div className="w-full h-7 skeleton mt-2" />
          </>
        ) : (
          <div className="w-full flex flex-col lg:flex-row justify-start items-start lg:items-end">
            {/* kode and status */}
            <div className="flex lg:flex-2 flex-col justify-start items-start">
              <div className="w-full px-2 flex flex-row justify-start items-start gap-2 mt-4">
                <h2 className="text-base-content text-lg lg:text-xl font-semibold">
                  {dataBarangMasukDetail?.data?.kodeReferensi}
                </h2>

                {/* status */}
                <StatusInventori
                  status={
                    dataBarangMasukDetail?.data?.status ??
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
                      dataBarangMasukDetail?.data?.createdAt ?? new Date(),
                    )}
                  </span>
                </p>

                {/* caption */}
                {isStatusPosted &&
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
                            dataBarangMasukDetail?.data?.postedAt ?? new Date(),
                            2,
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
                {dataBarangMasukDetail?.data?.status ===
                  STATUS_INVENTORI_TYPE.POSTED && (
                  <ButtonWithIcon
                    textColor="text-primary-white"
                    label="Cetak"
                    icon={Printer}
                    bgColor="bg-info"
                  />
                )}

                {/* button verifikasi */}
                {fromPengajuanBarang &&
                  pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
                  dataBarangMasukDetail?.data?.status ===
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
                            dataBarangMasukDetail?.data?.id,
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
                {(dataBarangMasukDetail?.data?.status ===
                  STATUS_INVENTORI_TYPE.DRAFT ||
                  (fromPengajuanBarang &&
                    dataBarangMasukDetail?.data?.status !==
                      STATUS_INVENTORI_TYPE.POSTED &&
                    dataBarangMasukDetail?.data?.status !==
                      STATUS_INVENTORI_TYPE.PENDING &&
                    pengguna?.role === ROLE_INTERNAL_TYPE.KASIR)) && (
                  <ButtonWithIcon
                    textColor="text-primary-white"
                    label="Hapus"
                    icon={Trash2}
                    bgColor="bg-error"
                    handleBtn={() =>
                      handleShowModalDelete(dataBarangMasukDetail?.data?.id, {
                        kodeReferensi:
                          dataBarangMasukDetail?.data?.kodeReferensi,
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
                          handlePosting(dataBarangMasukDetail?.data?.id);
                        } else {
                          handleShowModalFormulirVerifikasiOrPengajuan(
                            dataBarangMasukDetail?.data?.id,
                            { type: "pengajuan" },
                          );
                        }
                      } else if (isStatusPosted) {
                        if (fromPengajuanBarang) {
                          handleCancelVerifikasi(
                            dataBarangMasukDetail?.data?.id,
                          );
                        } else {
                          handleCancelPosting(dataBarangMasukDetail?.data?.id);
                        }
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
                          dataBarangMasukDetail?.data?.postedAt ?? new Date(),
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
      <InformasiBarangMasuk
        isLoadingBarangMasukDetail={isLoadingBarangMasukDetail}
        totalBarangMasuk={
          dataBarangMasukDetail?.data?.detailBarangMasuks?.length ?? 0
        }
        tanggalMasuk={dataBarangMasukDetail?.data?.tanggalMasuk}
        keterangan={dataBarangMasukDetail?.data?.keterangan ?? undefined}
        totalNilai={dataBarangMasukDetail?.data?.totalNilai ?? undefined}
        idBarangMasukDetail={dataBarangMasukDetail?.data?.id}
        handleSetToast={handleSetToast}
        status={dataBarangMasukDetail?.data?.status}
        author={dataBarangMasukDetail?.data?.author}
        tanggalDiajukan={
          dataBarangMasukDetail?.data?.tanggalDiajukan ?? undefined
        }
        isUpdate={isCanUpdate}
      />

      {/* formulir */}
      {canShowFormTambahBarang && (
        <FormulirTambahBarangMasuk
          handleSetToast={handleSetToast}
          handleSetAlert={handleSetAlert}
        />
      )}

      {/* show data */}
      <ShowDataBarangMasuk
        dataBarangMasukDetail={dataBarangMasukDetail}
        isLoadingBarangMasukDetail={isLoadingBarangMasukDetail}
        fromPengajuanBarang={fromPengajuanBarang}
        role={pengguna?.role}
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
      {fromPengajuanBarang && (
        <ModalFormulirVerifikasiOrPengajuan
          modalRef={modalFormulirVerifikasiOrPengajuan}
          handleCloseModal={handleCloseModalFormulirVerifikasiOrPengajuan}
          barangMasukId={idModalFormulirVerifikasiOrPengajuan}
          kodeReferensi={dataBarangMasukDetail?.data?.kodeReferensi ?? ""}
          type={dataModalFormulirVerifikasiOrPengajuan?.type}
          role={pengguna?.role}
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

export default BarangMasukDetail;
