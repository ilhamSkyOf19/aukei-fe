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
import ButtonInline from "../../../../components/ui/button/ButtonInline";
import CardForm from "../../../../components/inputs/CardForm";
import ModalInputDate from "../../../../components/modals/ModalInputDate";
import type { UpdateBarangMasukForRequestType } from "../../../../models/barangMasuk.model";
import InputTextAreaNonIcon from "../../../../components/inputs/InputTextAreaNonIcon";
import {
  ROLE_INTERNAL_TYPE,
  type RoleInternalType,
  type StatusInventoriType,
  type StatusStockOpnameType,
} from "../../../../types/constant.type";
import type { IPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import InformasiPengajuan from "../../../../components/ui/InformasiPengajuan";
import useInformasiStockOpnameDetail from "./useInformasiStockOpnameDetail";
import type { UpdateStockOpnameForRequestType } from "../../../../models/stockOpname.model";

type Props = {
  isLoadingStocOpnameDetail?: boolean;
  tanggal?: Date;
  keterangan?: string;
  totalProduk: number;
  idStockOpnameDetail?: number;
  handleSetToast: (data: string) => void;
  status?: StatusStockOpnameType;
  author?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "isActive" | "username" | "role"
  > | null;
  tanggalDiajukan?: Date;
  isUpdate?: boolean;
};
const InformasiStockOpnameDetail: FC<Props> = ({
  isLoadingStocOpnameDetail,
  keterangan,
  handleSetToast,
  status,
  author,
  tanggalDiajukan,
  isUpdate,
  totalProduk,
  idStockOpnameDetail,
  tanggal,
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
  } = useInformasiStockOpnameDetail({
    handleSetToast,
    keterangan,
    tanggal,
    status,
    idStockOpnameDetail,
  });

  return (
    <div className="w-full flex flex-col justify-start items-center lg:items-stretch lg:flex-row gap-2">
      {/* informasi author */}
      {author?.role === ROLE_INTERNAL_TYPE.KASIR && (
        <InformasiPengajuan
          author={author}
          isLoading={isLoadingStocOpnameDetail}
          tanggalDiajukan={tanggalDiajukan}
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

        {isLoadingStocOpnameDetail ? (
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
                    {formatTanggalLengkap(tanggal ?? new Date())} WIB
                  </span>

                  {/* button pencil */}
                  {isUpdate && (
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
                      {isUpdate && (
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
          <h2 className="text-base-content text-sm font-semibold">Ringkasan</h2>
        </div>

        {isLoadingStocOpnameDetail ? (
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
                <span className="text-xs text-base-content font-medium">
                  Total Produk
                </span>

                <span className={"text-sm font-medium"}>{totalProduk}</span>
              </div>
            </div>
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
  );
};

export default InformasiStockOpnameDetail;
