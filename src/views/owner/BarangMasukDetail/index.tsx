import { AlertTriangle, Check, Printer, Trash2 } from "lucide-react";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import StatusInventori from "../../../components/ui/StatusInventori";
import { STATUS_INVENTORI_TYPE } from "../../../types/constant.type";
import useBarangMasukDetail from "./useBarangMasukDetail";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import { cn } from "../../../utils/cn";
import { expireDateOneDay, formatRupiah } from "../../../helpers/helpers";
import ShowDataBarangMasuk from "./ShowBarangMasuk";
import InputSearch from "../../../components/inputs/InputSearch";
import InputNumber from "../../../components/inputs/InputNumber";
import ButtonSubmitWithIcon from "../../../components/ui/button/ButtonSubmitWithIcon";
import Alert from "../../../components/messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/toast.type";
import ModalAlert from "../../../components/modals/ModalAlert";
import type { CreateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import ModalFormulirTambahBarangMasuk from "../../../components/modals/ModalFormulirTambahBarangMasuk";
import ModalDelete from "../../../components/modals/ModalDelete";
import InformasiBarangMasuk from "./InformasiBarangMasuk";

const BarangMasukDetail = () => {
  // call use barang masuk detail
  const {
    dataBarangMasukDetail,
    isLoadingBarangMasukDetail,
    handleSearch,
    dataProdukForChoose,
    errors,
    handleSetValueProdukId,
    handleSubmit,
    isPendingBarangMasukDetail,
    onSubmit,
    alert,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    handleCloseActiveComponentChooseProduk,
    toast,
    handleDeleteValueProdukId,
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
    jumlahBoxController,
    inputSearchRef,
    handleCloseModalFormulirTambahBarang,
    handleShowModalFormulirTambahBarang,
    modalFormulirTambahBarangRef,
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    isPendingDelete,
    handleShowModalDelete,
    modalDeleteRef,
    handleSetToast,
  } = useBarangMasukDetail();

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
          label={TOAST_CONFIG_BARANG_MASUK_DETAIL[toast.type].message}
          color={TOAST_CONFIG_BARANG_MASUK_DETAIL[toast.type].color}
        />
      )}

      {/* header */}
      <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-2 lg:p-4">
        {/* button back */}
        <div className="w-30">
          <ButtonBackText label="Kembali" />
        </div>

        {isLoadingBarangMasukDetail ? (
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
                {isStatusPosted && (
                  <div className="hidden lg:flex flex-row justify-start items-center gap-2">
                    <div className="status status-success status-sm" />

                    <span className="text-xs text-base-content">
                      {`Anda dapat membatalkan postingan sebelum ${formatTanggalLengkap(
                        expireDateOneDay(
                          dataBarangMasukDetail?.data?.createdAt ?? new Date(),
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

                {dataBarangMasukDetail?.data?.status ===
                  STATUS_INVENTORI_TYPE.DRAFT && (
                  <ButtonWithIcon
                    textColor="text-primary-white"
                    label="Hapus"
                    icon={Trash2}
                    bgColor="bg-error"
                    handleBtn={() =>
                      handleShowModalDelete(
                        dataBarangMasukDetail?.data?.id,
                        dataBarangMasukDetail?.data?.kodeReferensi,
                      )
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
                        handlePosting(dataBarangMasukDetail?.data?.id ?? 0);
                      } else if (isStatusPosted) {
                        handleCancelPosting(
                          dataBarangMasukDetail?.data?.id ?? 0,
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
                          dataBarangMasukDetail?.data?.createdAt ?? new Date(),
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
      />

      {/* daftar produk masuk */}
      <div className="w-full flex flex-col justify-start items-center gap-2 mt-4 lg:mt-0">
        {/* header for sm */}
        {dataBarangMasukDetail?.data?.status ===
          STATUS_INVENTORI_TYPE.DRAFT && (
          <>
            <div className="w-full lg:hidden flex flex-row justify-between items-center">
              <div className="flex flex-col justify-start items-start gap-1.5">
                <p className="text-md font-semibold">Daftar Barang Masuk</p>
                <p className="text-xs px-3 py-1 rounded-full bg-gray-300">
                  {dataBarangMasukDetail?.data?.detailBarangMasuks.length}{" "}
                  barang
                </p>
              </div>

              {/* button add */}
              <ButtonWithIcon
                handleBtn={() => handleShowModalFormulirTambahBarang()}
              />
            </div>

            {/* form for lg */}
            <div className="hidden lg:flex flex-col justify-start items-start min-h-30 w-full card shadow-xs dark:border dark:border-base-content/10 bg-base-100 p-6">
              {/* title */}
              <div className="w-full flex flex-row justify-start items-center">
                <h2 className="text-base-content text-sm font-semibold">
                  Tambah Barang Masuk
                </h2>
              </div>

              {/* form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-row justify-start items-start mt-4 gap-8"
              >
                {/* produk */}
                <div
                  ref={wrapperRef}
                  className="flex-2 flex flex-col justify-start items-start gap-2"
                >
                  <div className="w-full flex flex-col justify-start items-start gap-2 relative">
                    {/* label */}
                    <div className="relative">
                      <label className="capitalize text-xs lg:text-sm text-base-content">
                        Cari Produk
                      </label>

                      <span className="absolute -top-1 ml-1 text-error">
                        {"*"}
                      </span>
                    </div>

                    <InputSearch
                      ref={inputSearchRef}
                      handleSearch={handleSearch}
                      placeholder="Cari produk berdasarkan nama atau kode"
                      handleOnFocus={() =>
                        handleShowActiveComponentChooseProduk()
                      }
                      handleClear={() =>
                        handleCloseActiveComponentChooseProduk()
                      }
                      errorMessage={errors.produkId?.message}
                    />

                    {/* modal show data produk for choose */}
                    <div
                      className={cn(
                        "absolute bg-base-100 w-full z-40 rounded-lg top-full grid transition-all duration-300 ease-in-out",
                        activeComponentChooseProduk
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-y-auto scrollbar-thin">
                        <div
                          className={cn(
                            "w-full flex flex-col h-60 rounded-lg shadow-xs border border-base-content/10 p-4 gap-2",
                          )}
                        >
                          {isLoadingProdukForChoose ? (
                            <div className="w-full h-full flex flex-col justify-center items-center">
                              <div className="loading loading-xl" />
                            </div>
                          ) : dataProdukForChoose?.data &&
                            dataProdukForChoose?.data?.length > 0 ? (
                            dataProdukForChoose?.data?.map((item, _) => (
                              <button
                                type="button"
                                key={item.id}
                                className="w-full flex flex-row justify-between items-start gap-1 hover:bg-custom-primary/50 p-2 transition-all duration-100 ease-in-out border-b border-base-content/10"
                                onClick={() => handleSetValueProdukId(item.id)}
                              >
                                <div className="flex-3 flex flex-row col row justify-start items-start gap-4">
                                  {/* img */}
                                  <div className="w-11 h-11 rounded-md overflow-hidden">
                                    <img
                                      src={item.img}
                                      alt="foto produk"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* nama */}
                                  <div className="flex flex-col justify-start items-start gap-1">
                                    <p className="text-sm font-semibold">
                                      {item.nama}
                                    </p>
                                    <p className="text-xs text-base-content/50 font-semibold">
                                      {item.kode}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-start items-start gap-1">
                                  {/* label */}
                                  <span className="text-[0.625rem] text-base-content/50">
                                    Harga Beli
                                  </span>
                                  {/* value */}
                                  <span className="text-[0.625rem] font-semibold text-base-content">
                                    {formatRupiah(item.hargaBeli)}
                                  </span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="w-full h-full flex flex-col justify-center items-center">
                              <p className="text-sm font-medium text-base-content/50">
                                Data produk tidak ditemukan
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* card produk choose */}
                  {produkChoose.length > 0 && (
                    <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
                      <p className="text-xs font-medium">
                        Daftar Pilihan Barang:
                      </p>
                      {produkChoose.map((item) => (
                        <div
                          key={item.id}
                          className="w-full flex flex-row justify-between items-center hover:bg-custom-primary/50 p-2 rounded-md transition-all duration-100 ease-in-out"
                        >
                          <div className="w-full flex flex-row justify-start items-start gap-2">
                            <div className="flex-2 w-full flex flex-row justify-start items-start gap-4">
                              {/* img */}
                              <div className="w-11 h-11 rounded-md overflow-hidden">
                                <img
                                  src={item.img}
                                  alt="foto produk"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* nama */}
                              <div className="flex flex-col justify-start items-start gap-1">
                                <p className="text-sm font-semibold">
                                  {item.nama}
                                </p>
                                <p className="text-xs text-base-content/50 font-medium">
                                  {item.kode}
                                </p>
                              </div>
                            </div>

                            {/* harga beli */}
                            <div className="flex-1 flex flex-col justify-start items-start gap-1">
                              {/* label */}
                              <span className="text-[0.625rem] text-base-content/50">
                                Harga Beli
                              </span>
                              {/* value */}
                              <span className="text-[0.625rem] font-semibold text-base-content">
                                {formatRupiah(item.hargaBeli)}
                              </span>
                            </div>
                          </div>

                          {/* button trash */}
                          <button
                            type="button"
                            className="p-2 hover-oveerlay rounded-full bg-error text-primary-white"
                            onClick={() => handleDeleteValueProdukId(item.id)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* input jumlah perbox */}
                <div className="flex-2 flex flex-row justify-start items-center">
                  <InputNumber<CreateBarangMasukDetailType>
                    controller={jumlahBoxController}
                    label="Jumlah Box"
                    placeholder="Jumlah Box"
                    required
                    max={1000000}
                  />
                </div>

                {/* button submit */}
                <div className="flex-1 flex flex-row justify-end items-end h-18">
                  <ButtonSubmitWithIcon
                    label="Tambah Barang Masuk"
                    isLoading={isPendingBarangMasukDetail}
                  />
                </div>
              </form>
            </div>
          </>
        )}

        {/* show data */}
        <ShowDataBarangMasuk
          dataBarangMasukDetail={dataBarangMasukDetail}
          isLoadingBarangMasukDetail={isLoadingBarangMasukDetail}
        />
      </div>
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

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahBarangMasuk
        modalRef={modalFormulirTambahBarangRef}
        handleCloseModal={handleCloseModalFormulirTambahBarang}
      />

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        bigTitle={`Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?`}
        highlightData={dataDelete}
        isLoadingDelete={isPendingDelete}
      />
    </div>
  );
};

export default BarangMasukDetail;
