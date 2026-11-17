import { type Dispatch, type FC, type SetStateAction } from "react";
import { cn } from "../../../../utils/cn";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CalendarDays,
  Check,
  Download,
  Package,
  PackageMinus,
  PackagePlus,
  Printer,
  Send,
  TextAlignStart,
  Trash2,
  X,
} from "lucide-react";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import CardForm from "../../../../components/inputs/CardForm";
import ModalInputDate from "../../../../components/modals/ModalInputDate";
import InputTextAreaNonIcon from "../../../../components/inputs/InputTextAreaNonIcon";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_STOCK_OPNAME_TYPE,
  type StatusStockOpnameType,
} from "../../../../types/constant.type";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import InformasiPengajuan from "../../../../components/ui/InformasiPengajuan";
import useInformasiStockOpnameDetail from "./useInformasiStockOpnameDetail";
import type { UpdateStockOpnameForRequestType } from "../../../../models/stockOpname.model";
import {
  formatNumber,
  formatRupiah,
  subtractMinutes,
} from "../../../../helpers/helpers";
import ButtonBackText from "../../../../components/ui/button/ButtonBackText";
import ButtonRefresh from "../../../../components/ui/button/ButtonRefresh";
import StatusStockOpname from "../../../../components/ui/StatusStockOpname";
import CountDown from "../../../../components/ui/CountDown";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import ModalDelete from "../../../../components/modals/ModalDelete";
import ModalAlert from "../../../../components/modals/ModalAlert";
import ModalFormulirVerifikasiOrPengajuanStockOpname from "../../../../components/modals/ModalFormulirVerifikasiOrPengajuanStockOpname";
import FormulirTambahProdukStockOpnameDetail from "../FormulirTambahProdukStockOpnameDetail";
import type { Alert } from "../../../../types/alert.types";

interface DataType {
  status: StatusStockOpnameType;
  isCanUpdate: boolean;
  produkIdChoose: number[];
}

type Props = {
  idStockOpnameDetail?: number | null;
  handleSetToast: (data: string) => void;
  handleSetData: Dispatch<SetStateAction<DataType | null>>;
  refreshDaftarProdukStockOpname: () => Promise<void>;
  pengguna: PayloadPenggunaInternalType | null;
  fromPengajuan?: boolean;
  handleSetAlert: (value: string) => void;
  alert?: Alert | null;
};
const InformasiStockOpnameDetail: FC<Props> = ({
  handleSetToast,
  fromPengajuan,
  pengguna,
  handleSetData,
  idStockOpnameDetail,
  refreshDaftarProdukStockOpname,
  handleSetAlert,
  alert,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    isPendingUpdate,
    keyUpdate,
    onSubmit,
    register,
    handleKeyUpdate,
    handleResetForm,
    handleCloseModalInputTanggalOpname,
    modalInputTanggalOpnameRef,
    tanggalOpnameController,
    dataStockOpnameDetail,
    isLoadingStockOpnameDetail,
    tanggalDiajukan,
    handleRefresh,
    isStatusApproved,
    isStatusDraft,
    isStatusPending,
    isStatusRejected,
    isExpired,
    isCanAjukan,
    isCanManageDetail,
    isCanVerifikasi,
    handleTolak,
    handleSetuju,
    isPendingSetuju,
    handleDeleteStockOpname,
    isPendingDeleteStockOpname,
    handleCloseModalDeleteStockOpname,
    handleShowModalDeleteStockOpname,
    modalDeleteStockOpnameRef,
    handleCloseModalFormulir,
    handlePosting,
    isPendingPosting,
    modalFormulirRef,
    handleCancelPosting,
    handleCancelVerifikasi,
    isPendingCancelPosting,
    isPendingCancelVerifikasi,
    handleAjukan,
    dataDeleteStockOpname,
    dataConfirm,
    handleCancel,
    handleConfirm,
    modalKonfirmasiRef,
    idModalFormulir,
    dataModalFormulir,
    handleBack,
  } = useInformasiStockOpnameDetail({
    handleSetToast,
    idStockOpnameDetail,
    handleSetData,
    refreshDaftarProdukStockOpname,
    fromPengajuan,
    pengguna,
    handleSetAlert,
  });

  return (
    <>
      <div
        className={cn(
          "bg-base-100 rounded-2xl md:rounded-xl",
          "shadow-sm border border-transparent",
          "dark:border-base-content/10",
          "w-full flex flex-col justify-start p-2 lg:p-4",
        )}
      >
        {/* BUTTON BACK */}

        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-30">
            <ButtonBackText label="Kembali" handleClick={handleBack} />
          </div>

          {/* button refetch */}
          <ButtonRefresh
            handleRefresh={() => handleRefresh()}
            notLoadingGlobal
          />
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
                  {dataStockOpnameDetail?.data?.kodeReferensi}
                </h2>

                <StatusStockOpname
                  status={
                    dataStockOpnameDetail?.data?.status ??
                    STATUS_STOCK_OPNAME_TYPE.DRAFT
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
                      dataStockOpnameDetail?.data?.createdAt ?? new Date(),
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
                        isLoading={isPendingDeleteStockOpname}
                        handleBtn={() =>
                          handleShowModalDeleteStockOpname(
                            dataStockOpnameDetail?.data?.id,
                            {
                              kodeReferensi:
                                dataStockOpnameDetail?.data?.kodeReferensi,
                            },
                          )
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

      <div className="w-full flex flex-col justify-start items-center lg:items-stretch lg:flex-row gap-2">
        {/* informasi author */}
        {dataStockOpnameDetail?.data?.adminOpname?.role ===
          ROLE_INTERNAL_TYPE.KASIR && (
          <InformasiPengajuan
            author={dataStockOpnameDetail?.data?.adminOpname}
            isLoading={isLoadingStockOpnameDetail}
            tanggalDiajukan={tanggalDiajukan}
            stockOpname
          />
        )}
        {/* informasi stok opname */}
        <div
          className={cn(
            " rounded-2xl md:rounded-xl bg-base-100 shadow-xs border border-transparent dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6",
          )}
        >
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <h2 className="text-base-content text-sm font-semibold">
              Informasi Stok Opname
            </h2>
          </div>

          {isLoadingStockOpnameDetail ? (
            <>
              <div className="w-full h-8 skeleton mt-4" />
              <div className="w-full h-8 skeleton mt-2" />
            </>
          ) : (
            <>
              {/* tanggal stock opname */}
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
                    Tanggal Stok Opname
                  </span>

                  {/* value */}
                  <div className="flex flex-row justify-end items-center">
                    <span className={" text-xs font-medium text-base-content"}>
                      {formatTanggalLengkap(
                        dataStockOpnameDetail?.data?.tanggalOpname ??
                          new Date(),
                      )}{" "}
                      WIB
                    </span>

                    {/* button pencil */}
                    {isCanManageDetail && (
                      <div className="border-l border-base-content/30 pl-3 ml-3">
                        <ButtonInline
                          customHidden="block"
                          handleKeyUpdate={() => handleKeyUpdate("tanggal")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* keterangan barang masuk */}
              <div className="w-full flex flex-row justify-between items-start gap-3 mt-6">
                {/* icon */}
                <div className="h-full flex flex-row justify-start items-start">
                  <TextAlignStart className="size-5 text-info" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-col justify-start pb-3 border-b border-base-content/10 items-start",
                  )}
                >
                  {/* label */}
                  <span className="text-xs text-base-content font-medium">
                    Keterangan
                  </span>

                  <div
                    className={cn(
                      "flex w-full flex-row justify-start items-start gap-4",
                    )}
                  >
                    {keyUpdate !== "keterangan" ? (
                      <div className="w-full flex flex-row justify-between items-center gap-4">
                        <div className="mt-2">
                          {dataStockOpnameDetail?.data?.keterangan ? (
                            <span className="text-xs text-base-content leading-5">
                              {dataStockOpnameDetail?.data?.keterangan}
                            </span>
                          ) : (
                            <span className="text-xs text-base-content/50 italic">
                              Tidak ada keterangan
                            </span>
                          )}
                        </div>

                        {/* button pencil */}
                        {isCanManageDetail && (
                          <div className="border-l border-base-content/30 pl-3 ml-3">
                            <ButtonInline
                              customHidden="block"
                              handleKeyUpdate={() =>
                                handleKeyUpdate("keterangan")
                              }
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <CardForm
                        handleResetForm={handleResetForm}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        isPending={isPendingUpdate}
                        showForSm
                        hAuto
                        btnAksiPosition="top"
                        customFlex="flex-col items-end lg:flex-row lg:items-center lg:gap-3"
                      >
                        {/* input text */}
                        <div className="w-60 lg:w-80">
                          <InputTextAreaNonIcon
                            register={register("keterangan")}
                            name="keterangan"
                            placeholder="Masukan keterangan"
                            errorMessage={errors?.keterangan?.message}
                            required
                            rows={4}
                          />
                        </div>
                      </CardForm>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* informasi ringkasan */}
        <div
          className={cn(
            "rounded-2xl md:rounded-xl bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6",
          )}
        >
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <h2 className="text-base-content text-sm font-semibold">
              Ringkasan
            </h2>
          </div>

          {isLoadingStockOpnameDetail ? (
            <>
              <div className="w-full h-8 skeleton mt-4" />
              <div className="w-full h-8 skeleton mt-2" />
            </>
          ) : (
            <>
              <div className="w-full flex flex-row justify-between items-start gap-3 mt-8">
                {/* icon */}
                <div className="h-full flex flex-row justify-start items-start">
                  <Package className="size-5 text-emerald-600" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
                  )}
                >
                  {/* label */}
                  <span className="text-xs text-base-content font-medium">
                    Total Produk
                  </span>

                  <span className={"text-sm font-medium"}>
                    {formatNumber(
                      dataStockOpnameDetail?.data?.totalProduk ?? 0,
                    )}
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-row justify-between items-start gap-3 mt-2.5">
                <div className="h-full flex flex-row justify-start items-start">
                  <PackageMinus className="size-5 text-rose-600" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
                  )}
                >
                  {/* label */}
                  <span className="text-xs text-base-content font-medium">
                    Total Item Minus
                  </span>

                  <span className={"text-sm font-medium"}>
                    {formatNumber(
                      dataStockOpnameDetail?.data?.totalItemMinus ?? 0,
                    )}
                  </span>
                </div>
              </div>

              {/* label and value */}
              {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
                <div className="w-full flex flex-row justify-between items-start gap-3 mt-2.5">
                  <div className="h-full flex flex-row justify-start items-start">
                    <BanknoteArrowDown className="size-5 text-rose-600" />
                  </div>
                  <div
                    className={cn(
                      "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
                    )}
                  >
                    {/* label */}
                    <span className="text-xs text-base-content font-medium">
                      Total Nilai Minus
                    </span>

                    <span className={"text-sm font-medium text-rose-600"}>
                      {formatRupiah(
                        dataStockOpnameDetail?.data?.totalNilaiMinus ?? 0,
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="w-full flex flex-row justify-between items-start gap-3 mt-2.5">
                <div className="h-full flex flex-row justify-start items-start">
                  <PackagePlus className="size-5 text-emerald-600" />
                </div>

                {/* label and value */}
                <div
                  className={cn(
                    "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
                  )}
                >
                  {/* label */}
                  <span className="text-xs text-base-content font-medium">
                    Total Item Surplus
                  </span>

                  <span className={"text-sm font-medium"}>
                    {formatNumber(
                      dataStockOpnameDetail?.data?.totalItemSurplus ?? 0,
                    )}
                  </span>
                </div>
              </div>

              {/* label and value */}
              {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
                <div className="w-full flex flex-row justify-between items-start gap-3 mt-2.5">
                  <div className="h-full flex flex-row justify-start items-start">
                    <BanknoteArrowUp className="size-5 text-emerald-600" />
                  </div>

                  <div
                    className={cn(
                      "w-full flex flex-row justify-between pb-3 border-b border-base-content/10 items-center",
                    )}
                  >
                    {/* label */}
                    <span className="text-xs text-base-content font-medium">
                      Total Nilai Surplus
                    </span>

                    <span className={"text-sm font-medium text-emerald-600"}>
                      {formatRupiah(
                        dataStockOpnameDetail?.data?.totalNilaiSurplus ?? 0,
                      )}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* modal input tanggal masuk */}
        <ModalInputDate<UpdateStockOpnameForRequestType>
          modalRef={modalInputTanggalOpnameRef}
          handleCloseModal={handleCloseModalInputTanggalOpname}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          useControll={tanggalOpnameController}
          isPending={isPendingUpdate}
          bigTitle="Formulir Ubah Tanggal Opname"
          smallTitle="Ubah tanggal opname"
        />
      </div>

      {isCanManageDetail && (
        <FormulirTambahProdukStockOpnameDetail
          handleSetToast={handleSetToast}
          handleSetAlert={handleSetAlert}
          alert={alert}
          role={pengguna?.role}
          produkChooseIds={dataStockOpnameDetail?.data?.produkIdChooses ?? []}
          isGlobalLoading={isLoadingStockOpnameDetail}
        />
      )}

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
        kodeReferensi={dataStockOpnameDetail?.data?.kodeReferensi ?? ""}
        type={dataModalFormulir?.type}
        role={pengguna?.role}
        handleSetAlert={handleSetAlert}
      />

      {/* ============================================================
        MODAL DELETE DETAIL
    ============================================================ */}

      {/* <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        bigTitle={
          "Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?"
        }
        highlightData={"ok"}
        isLoadingDelete={isPendingDelete}
      /> */}

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
    </>
  );
};

export default InformasiStockOpnameDetail;
