import { type FC } from "react";
import { formatRupiah } from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";
import {
  BanknoteArrowDown,
  CalendarDays,
  Package,
  TextAlignStart,
} from "lucide-react";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import useInformasiBarangMasuk from "./useInformasiBarangMasuk";
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import CardForm from "../../../../components/inputs/CardForm";
import ModalInputDate from "../../../../components/modals/ModalInputDate";
import type { UpdateBarangMasukForRequestType } from "../../../../models/barangMasuk.model";
import InputTextNonIcon from "../../../../components/inputs/InputTextNonIcon";
import InputTextAreaNonIcon from "../../../../components/inputs/InputTextAreaNonIcon";

type Props = {
  isLoadingBarangMasukDetail?: boolean;
  tanggalMasuk?: Date;
  keterangan?: string;
  totalBarangMasuk: number;
  totalNilai?: string;
  idBarangMasukDetail?: number;
  handleSetToast: (data: string) => void;
};
const InformasiBarangMasuk: FC<Props> = ({
  isLoadingBarangMasukDetail,
  totalBarangMasuk,
  keterangan,
  tanggalMasuk,
  totalNilai,
  idBarangMasukDetail,
  handleSetToast,
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
  });

  return (
    <div className="w-full flex flex-col justify-start items-center lg:items-start lg:flex-row gap-4">
      <div className="card bg-base-100 shadow-xs dark:border dark:border-base-content/10 w-full flex flex-col justify-start p-4 lg:p-6 lg:min-h-55">
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
                <div className="flex flex-row justify-end items-start">
                  <span className={"text-[0.625rem] lg:text-sm font-medium"}>
                    {formatTanggalLengkap(tanggalMasuk ?? new Date())} WIB
                  </span>

                  {/* button pencil */}
                  <div className="border-l border-base-content/30 pl-3 ml-3">
                    <ButtonInline
                      handleKeyUpdate={() => handleKeyUpdate("tanggalMasuk")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* keterangan barang masuk */}
            <div className="w-full flex flex-row justify-between items-start gap-3 mt-4">
              {/* icon */}
              <div className="h-full flex flex-row justify-start items-start">
                <TextAlignStart className="size-5 text-info" />
              </div>

              {/* label and value */}
              <div
                className={cn(
                  "w-full flex flex-col justify-start pb-3 border-b border-base-content/10 items-start",
                  keyUpdate === "keterangan" && "gap-6",
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
                      <div className="border-l border-base-content/30 pl-3 ml-3">
                        <ButtonInline
                          handleKeyUpdate={() => handleKeyUpdate("keterangan")}
                        />
                      </div>
                    </div>
                  ) : (
                    <CardForm
                      handleResetForm={handleResetForm}
                      handleSubmit={handleSubmit}
                      onSubmit={onSubmit}
                      isPending={isPendingUpdate}
                    >
                      {/* input text */}
                      <div className="w-80">
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
            <div className="w-full flex flex-row justify-between items-start gap-3 mt-4">
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
      />
    </div>
  );
};

export default InformasiBarangMasuk;
