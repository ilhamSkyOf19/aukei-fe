import { AlertTriangle, Check, Printer, Trash2 } from "lucide-react";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import StatusInventori from "../../../components/ui/StatusInventori";
import { STATUS_INVENTORI_TYPE } from "../../../types/constant.type";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import Alert from "../../../components/messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_BARANG_KELUAR_DETAIL } from "../../../types/toast.type";
import ModalAlert from "../../../components/modals/ModalAlert";
import ModalDelete from "../../../components/modals/ModalDelete";
import useBarangKeluarDetail from "./useBarangKeluarDetail";
import ShowDataBarangKeluar from "./ShowDataBarangKeluar";
import InformasiBarangKeluar from "./InformasiBarangKeluar";
import FormulirTambahBarangKeluar from "./FormulirTambahBarangKeluar";
import { expireDateOneDay } from "../../../helpers/helpers";

const BarangKeluarDetail = () => {
  // call use barang masuk detail
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
  } = useBarangKeluarDetail();

  return (
    <div className="w-full flex flex-col justify-start items-start pt-4 px-2.5 gap-4 pb-70">
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
          label={TOAST_CONFIG_BARANG_KELUAR_DETAIL[toast.type].message}
          color={TOAST_CONFIG_BARANG_KELUAR_DETAIL[toast.type].color}
        />
      )}

      {/* header */}
      <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-2 lg:p-4">
        {/* button back */}
        <div className="w-30">
          <ButtonBackText label="Kembali" />
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
            <div className="flex lg:flex-2 flex-col justify-start items-start">
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
                {isStatusPosted && (
                  <div className="hidden lg:flex flex-row justify-start items-center gap-2">
                    <div className="status status-success status-sm" />

                    <span className="text-xs text-base-content">
                      {isExpired
                        ? "Anda tidak dapat membatalkan postingan karena sudah melewati batas waktu"
                        : `Anda dapat membatalkan postingan sebelum ${formatTanggalLengkap(
                            expireDateOneDay(
                              dataBarangKeluarDetail?.data?.createdAt ??
                                new Date(),
                            ),
                          )} WIB`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col lg:flex-row justify-start items-start lg:items-center lg:justify-end gap-3 px-2 lg:px-0 pb-2 lg:pb-0">
              {/* button */}
              <div className="w-full lg:w-auto flex flex-row justify-start items-start gap-2  mt-6 lg:mt-0">
                <ButtonWithIcon
                  textColor="text-primary-white"
                  label="Cetak"
                  icon={Printer}
                  bgColor="bg-info"
                />

                {dataBarangKeluarDetail?.data?.status ===
                  STATUS_INVENTORI_TYPE.DRAFT && (
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
              {(isStatusDraft || (isStatusPosted && !isExpired)) && (
                <div className="flex flex-col justify-start items-start w-full lg:w-auto gap-2 lg:gap-0">
                  <ButtonWithIcon
                    handleBtn={() => {
                      if (isStatusDraft) {
                        handlePosting(dataBarangKeluarDetail?.data?.id ?? 0);
                      } else if (isStatusPosted) {
                        handleCancelPosting(
                          dataBarangKeluarDetail?.data?.id ?? 0,
                        );
                      }
                    }}
                    icon={Check}
                    bgColor={isStatusDraft ? "bg-custom-primary" : "bg-error"}
                    textColor={
                      isStatusDraft
                        ? "text-custom-secondary"
                        : "text-primary-white"
                    }
                    label={
                      isStatusPosted
                        ? "Batalkan Posting"
                        : isStatusDraft
                          ? "Posting Sekarang"
                          : ""
                    }
                    customWidth="w-full lg:w-auto"
                  />

                  {/* caption */}
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
      />

      {/* daftar produk masuk */}
      <FormulirTambahBarangKeluar
        status={dataBarangKeluarDetail?.data?.status}
        totalBarang={
          dataBarangKeluarDetail?.data?.detailBarangKeluars?.length ?? 0
        }
        handleSetToast={handleSetToast}
        handleSetAlert={handleSetAlert}
      />

      {/* show data */}
      <ShowDataBarangKeluar
        isLoadingBarangKeluarDetail={isLoadingBarangKeluarDetail}
        dataBarangKeluarDetail={dataBarangKeluarDetail}
      />

      {/* modal konfirmasi */}
      <ModalAlert
        modalRef={modalKonfirmasiPostingRef}
        handleCloseModal={handleCancelConfirmPosting}
        handleConfirm={handleConfirmPosting}
        bigTitle={
          isStatusDraft
            ? "Apakah Anda yakin ingin memposting data barang masuk?"
            : isStatusPosted
              ? "Apakah Anda yakin ingin membatalkan posting data barang masuk?"
              : ""
        }
        smallTitle={
          isStatusDraft
            ? "Pastikan seluruh data barang masuk telah sesuai. Setelah diposting, stok barang akan diperbarui dan transaksi akan tercatat dalam sistem."
            : isStatusPosted
              ? "Stok akan dikembalikan ke kondisi sebelum posting. Setelah pembatalan, transaksi dapat diedit dan diposting kembali."
              : ""
        }
        isLoading={isPendingPosting || isPendingCancelPosting}
        icon={AlertTriangle}
        iconColor="text-warning"
      />

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        bigTitle={`Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?`}
        highlightData={dataDelete?.kodeReferensi}
        isLoadingDelete={isPendingDelete}
      />
    </div>
  );
};

export default BarangKeluarDetail;
