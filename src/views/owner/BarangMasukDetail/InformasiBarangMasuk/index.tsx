import { type FC } from "react";
import { formatRupiah } from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";
import {
  BanknoteArrowDown,
  CalendarDays,
  Eye,
  History,
  Package,
  TextAlignStart,
  UserRound,
} from "lucide-react";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import useInformasiBarangMasuk from "./useInformasiBarangMasuk";
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import CardForm from "../../../../components/inputs/CardForm";
import ModalInputDate from "../../../../components/modals/ModalInputDate";
import type { UpdateBarangMasukForRequestType } from "../../../../models/barangMasuk.model";
import InputTextAreaNonIcon from "../../../../components/inputs/InputTextAreaNonIcon";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";
import type { IPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

type Props = {
  isLoadingBarangMasukDetail?: boolean;
  tanggalMasuk?: Date;
  keterangan?: string;
  totalBarangMasuk: number;
  totalNilai?: string;
  idBarangMasukDetail?: number;
  handleSetToast: (data: string) => void;
  status?: StatusInventoriType;
  author?: Pick<IPenggunaInternalType, "id" | "nama" | "isActive" | "username">;
  tanggalDiAjukan?: Date;
};
const InformasiBarangMasuk: FC<Props> = ({
  isLoadingBarangMasukDetail,
  totalBarangMasuk,
  keterangan,
  tanggalMasuk,
  totalNilai,
  idBarangMasukDetail,
  handleSetToast,
  status,
  author,
  tanggalDiAjukan,
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
    handleCloseModalInputTanggalMasuk,
    modalInputTanggalMasukRef,
    tanggalMasukController,
  } = useInformasiBarangMasuk({
    handleSetToast,
    keterangan,
    tanggalMasuk,
    idBarangMasukDetail,
    status,
  });

  return (
    <div className="w-full flex flex-col justify-start items-center lg:items-start lg:flex-row gap-2">
      {/* informasi author */}
      {author && (
        <div className="card bg-base-100 shadow-xs border border-transparent dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6 lg:min-h-70">
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <h2 className="text-base-content text-sm font-semibold">
              Informasi Pengajuan
            </h2>
          </div>

          {isLoadingBarangMasukDetail ? (
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
                  <span className="flex-1 text-xs lg:text-sm text-base-content/90 font-medium">
                    Diajukan Oleh
                  </span>

                  {/* value */}
                  <div className="flex-2 flex flex-row justify-end items-start">
                    {/* di ajukan oleh */}
                    <div className="w-full flex flex-row justify-end items-center gap-4">
                      {/* nama */}
                      <div className="px-4 flex flex-col justify-center items-start border-r border-base-content/10">
                        <span
                          className={"text-[0.625rem] lg:text-sm font-medium"}
                        >
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
                  <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                    Tanggal Diajukan
                  </span>

                  {/* value */}
                  <div className="flex flex-row justify-end items-center">
                    <span className={"text-[0.625rem] lg:text-sm font-medium"}>
                      {formatTanggalLengkap(tanggalDiAjukan ?? new Date())} WIB
                    </span>
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
                  <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                    Riwayat Pengajuan
                  </span>

                  {/* value */}
                  <div className="flex flex-row justify-end items-center">
                    <ButtonWithIcon
                      label="Lihat"
                      icon={Eye}
                      handleBtn={() => {}}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {/* informasi barang masuk */}
      <div
        className={cn(
          "card bg-base-100 shadow-xs border border-transparent dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6",
          author ? "lg:min-h-70" : "lg:min-h-55",
        )}
      >
        {/* title */}
        <div className="w-full flex flex-row justify-start items-center">
          <h2 className="text-base-content text-sm font-semibold">
            Informasi Barang Masuk
          </h2>
        </div>

        {isLoadingBarangMasukDetail ? (
          <>
            <div className="w-full h-8 skeleton mt-4" />
            <div className="w-full h-8 skeleton mt-2" />
          </>
        ) : (
          <>
            {/* tanggal barang masuk */}
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
                <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                  Tanggal Barang Masuk
                </span>

                {/* value */}
                <div className="flex flex-row justify-end items-center">
                  <span className={"text-[0.625rem] lg:text-sm font-medium"}>
                    {formatTanggalLengkap(tanggalMasuk ?? new Date())} WIB
                  </span>

                  {/* button pencil */}
                  {status === STATUS_INVENTORI_TYPE.DRAFT && (
                    <div className="border-l border-base-content/30 pl-3 ml-3">
                      <ButtonInline
                        customHidden="block"
                        handleKeyUpdate={() => handleKeyUpdate("tanggalMasuk")}
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
                <span className="text-xs lg:text-sm text-base-content/90 font-medium">
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
                        {keterangan ? (
                          <span className="text-xs text-base-content leading-5">
                            {keterangan}
                          </span>
                        ) : (
                          <span className="text-xs text-base-content/50 italic">
                            Tidak ada keterangan
                          </span>
                        )}
                      </div>

                      {/* button pencil */}
                      {status === STATUS_INVENTORI_TYPE.DRAFT && (
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
                          xs
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
          "card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6",
          author ? "lg:min-h-70" : "lg:min-h-55",
        )}
      >
        {/* title */}
        <div className="w-full flex flex-row justify-start items-center">
          <h2 className="text-base-content text-sm font-semibold">Ringkasan</h2>
        </div>

        {isLoadingBarangMasukDetail ? (
          <>
            <div className="w-full h-8 skeleton mt-4" />
            <div className="w-full h-8 skeleton mt-2" />
          </>
        ) : (
          <>
            {/* tanggal barang masuk */}
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
                <span className="text-xs lg:text-sm text-base-content font-medium">
                  Total Barang Masuk
                </span>

                <span className={"text-sm font-medium"}>
                  {totalBarangMasuk}
                </span>
              </div>
            </div>

            {/* keterangan barang masuk */}
            <div className="w-full flex flex-row justify-between items-start gap-3 mt-6">
              {/* icon */}
              <div className="h-full flex flex-row justify-start items-start">
                <BanknoteArrowDown className="size-5 text-info" />
              </div>

              {/* label and value */}
              <div
                className={cn(
                  "w-full flex flex-col justify-between pb-3 border-b border-base-content/10 items-start",
                )}
              >
                {/* label */}
                <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                  Total Nilai
                </span>

                {/* keterangan */}
                <div className="mt-2">
                  <span className="text-lg text-base-content font-semibold">
                    {formatRupiah(totalNilai ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* modal input tanggal masuk */}
      <ModalInputDate<UpdateBarangMasukForRequestType>
        modalRef={modalInputTanggalMasukRef}
        handleCloseModal={handleCloseModalInputTanggalMasuk}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        useControll={tanggalMasukController}
        isPending={isPendingUpdate}
        bigTitle="Formulir Ubah Tanggal Barang Masuk"
        smallTitle="Ubah tanggal barang masuk"
      />
    </div>
  );
};

export default InformasiBarangMasuk;
