import { type FC } from "react";
import { formatRupiah } from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";
import {
  BanknoteArrowUp,
  CalendarDays,
  Package,
  PackageMinus,
  TextAlignStart,
} from "lucide-react";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import CardForm from "../../../../components/inputs/CardForm";
import ModalInputDate from "../../../../components/modals/ModalInputDate";
import InputTextAreaNonIcon from "../../../../components/inputs/InputTextAreaNonIcon";
import type { IJenisKeluarType } from "../../../../models/jenisKeluar.model";
import useInformasiBarangKeluar from "./useInformasiBarangKeluar";
import type { UpdateBarangKeluarForRequestType } from "../../../../models/barangKeluar.model";
import JenisKeluar from "../../../../components/ui/JenisKeluar";
import InputChoose from "../../../../components/inputs/InputChoose";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";

type Props = {
  isLoadingBarangKeluarDetail?: boolean;
  tanggalKeluar?: Date;
  keterangan?: string;
  totalBarangKeluar: number;
  totalNilai?: string;
  idBarangKeluarDetail?: number;
  handleSetToast: (data: string) => void;
  jenisKeluar?: Pick<IJenisKeluarType, "id" | "nama">;
  status?: StatusInventoriType;
};
const InformasiBarangKeluar: FC<Props> = ({
  isLoadingBarangKeluarDetail,
  keterangan,
  totalNilai,
  handleSetToast,
  jenisKeluar,
  totalBarangKeluar,
  idBarangKeluarDetail,
  tanggalKeluar,
  status,
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
    handleCloseModalInputTanggalKeluar,
    modalInputTanggalKeluarRef,
    tanggalKeluarController,
    jenisKeluarIdController,
    dataJenisKeluarForChoose,
    isLoadingJenisKeluar,
  } = useInformasiBarangKeluar({
    handleSetToast,
    keterangan,
    tanggalKeluar,
    idBarangKeluarDetail,
    jenisKeluar,
    status,
  });

  return (
    <div className="w-full flex flex-col justify-start items-center lg:items-start lg:flex-row gap-4">
      <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6 lg:min-h-55">
        {/* title */}
        <div className="w-full flex flex-row justify-start items-center">
          <h2 className="text-base-content text-sm font-semibold">
            Informasi Barang Keluar
          </h2>
        </div>

        {isLoadingBarangKeluarDetail ? (
          <>
            <div className="w-full h-8 skeleton mt-4" />
            <div className="w-full h-8 skeleton mt-2" />
          </>
        ) : (
          <>
            {/* tanggal barang keluar */}
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
                  Tanggal Barang Keluar
                </span>

                {/* value */}
                <div className="flex flex-row justify-end items-center">
                  <span className={"text-[0.625rem] lg:text-sm font-medium"}>
                    {formatTanggalLengkap(tanggalKeluar ?? new Date())} WIB
                  </span>

                  {/* button pencil */}
                  {status === STATUS_INVENTORI_TYPE.DRAFT && (
                    <div className="border-l border-base-content/30 pl-3 ml-3">
                      <ButtonInline
                        customHidden="block"
                        handleKeyUpdate={() => handleKeyUpdate("tanggalKeluar")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* jenis keluar  */}
            <div className="w-full flex flex-row justify-between items-start gap-3 mt-6">
              {/* icon */}
              <div className="h-full flex flex-row justify-start items-start">
                <PackageMinus className="size-5 text-error" />
              </div>

              {/* label and value */}
              <div
                className={cn(
                  "w-full flex flex-row justify-between pb-3 border-b border-base-content/10",
                  keyUpdate === "jenisKeluar" ? "items-start" : "items-center",
                )}
              >
                {/* label */}
                <span className="text-xs lg:text-sm text-base-content/90 font-medium">
                  Jenis Keluar
                </span>

                {/* value */}
                <div className="flex flex-row justify-end items-start">
                  {keyUpdate !== "jenisKeluar" ? (
                    <div className="w-full flex flex-row justify-between items-center">
                      {jenisKeluar ? (
                        <span
                          className={"text-[0.625rem] lg:text-sm font-medium"}
                        >
                          <JenisKeluar jenisKeluar={jenisKeluar?.nama ?? ""} />
                        </span>
                      ) : (
                        <span className="text-xs text-base-content/50 italic">
                          Tidak ada Jenis Keluar
                        </span>
                      )}

                      {/* button pencil */}
                      {status === STATUS_INVENTORI_TYPE.DRAFT && (
                        <div className="border-l border-base-content/30 pl-3 ml-3">
                          <ButtonInline
                            customHidden="block"
                            handleKeyUpdate={() =>
                              handleKeyUpdate("jenisKeluar")
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
                      disabled={isLoadingJenisKeluar}
                      showForSm
                      hAuto
                      btnAksiPosition="top"
                      customFlex="flex-col items-end lg:flex-row lg:items-center lg:gap-3"
                    >
                      {/* input choose */}
                      <div className="w-55 lg:w-80">
                        {isLoadingJenisKeluar ? (
                          <div className="w-full h-8 skeleton mb-3" />
                        ) : (
                          <InputChoose<UpdateBarangKeluarForRequestType>
                            chooseList={
                              dataJenisKeluarForChoose?.data?.map((item) => ({
                                label: item.nama,
                                value: item.id,
                              })) ?? []
                            }
                            controller={jenisKeluarIdController}
                            placeholder="Masukan keterangan"
                            required
                            xs
                          />
                        )}
                      </div>
                    </CardForm>
                  )}
                </div>
              </div>
            </div>

            {/* keterangan barang keluar */}
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

                <div className="flex w-full flex-row justify-start items-start gap-4">
                  {keyUpdate !== "keterangan" ? (
                    <div className="w-full flex flex-row justify-between items-start gap-4">
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
      <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6 lg:min-h-55">
        {/* title */}
        <div className="w-full flex flex-row justify-start items-center">
          <h2 className="text-base-content text-sm font-semibold">Ringkasan</h2>
        </div>

        {isLoadingBarangKeluarDetail ? (
          <>
            <div className="w-full h-8 skeleton mt-4" />
            <div className="w-full h-8 skeleton mt-2" />
          </>
        ) : (
          <>
            {/* tanggal barang keluar */}
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
                  Total Barang Keluar
                </span>

                <span className={"text-sm font-medium"}>
                  {totalBarangKeluar}
                </span>
              </div>
            </div>

            {/* keterangan barang masuk */}
            <div className="w-full flex flex-row justify-between items-start gap-3 mt-6">
              {/* icon */}
              <div className="h-full flex flex-row justify-start items-start">
                <BanknoteArrowUp className="size-5 text-error" />
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
      <ModalInputDate<UpdateBarangKeluarForRequestType>
        modalRef={modalInputTanggalKeluarRef}
        handleCloseModal={handleCloseModalInputTanggalKeluar}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        useControll={tanggalKeluarController}
        isPending={isPendingUpdate}
        bigTitle="Formulir Ubah Tanggal Barang Keluar"
        smallTitle="Ubah tanggal barang keluar"
      />
    </div>
  );
};

export default InformasiBarangKeluar;
