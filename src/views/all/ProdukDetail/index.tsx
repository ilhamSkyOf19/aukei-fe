import {
  ArrowLeft,
  Box,
  CalendarDays,
  CircleCheck,
  Clock,
  PencilLineIcon,
  SendHorizonal,
  TriangleAlert,
  X,
} from "lucide-react";
import ButtonActionWithIcon from "../../../components/ui/button/ButtonActionWithIcon";
import useProdukDetail from "./useProdukDetail";
import { formatRupiah, generateColorForStok } from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import InputTextNonIcon from "../../../components/inputs/InputTextNonIcon";
import type { UseFormHandleSubmit } from "react-hook-form";
import type { UpdateProdukType } from "../../../models/produk.model";
import type { FC, ReactNode } from "react";
import InputChoose from "../../../components/inputs/InputChoose";
import InputPrice from "../../../components/inputs/InputPrice";
import InputNumber from "../../../components/inputs/InputNumber";

const ProdukDetail = () => {
  // call use
  const {
    handleRedirectDetail,
    isExistData,
    isLoadingDataProduk,
    dataProduk,
    handleKeyUpdate,
    register,
    errors,
    keyUpdate,
    handleResetForm,
    onSubmit,
    handleSubmit,
    isPendingUpdateProduk,
    kategoriController,
    dataKategoriForChoose,
    isLoadingKategoriForChoose,
    hargaBeliController,
    hargaJualController,
  } = useProdukDetail();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start px-2 lg:px-4">
      {/* Cluster inventori */}
      <div className="card w-full bg-base-100 flex flex-col justify-start items-start p-4 mt-4">
        {/* header */}
        <div className="w-full flex flex-row justify-center items-center gap-2">
          {/* button back */}
          <div className="flex flex-1 flex-row justify-start items-center">
            <ButtonBackText />
          </div>

          <div className="flex flex-1 flex-row justify-center items-center">
            {/* title */}
            <h2 className="text-sm lg:text-base font-semibold text-base-content">
              Data Produk
            </h2>
          </div>

          {/* aksi */}
          <div className="flex flex-1 flex-row justify-end items-center">
            <div className=" lg:hidden">
              {/* button update */}
              <ButtonActionWithIcon
                icon={PencilLineIcon}
                label="Ubah"
                handleClick={() => handleRedirectDetail()}
                buttonColor="btn-info"
                textColor="text-primary-white"
                iconColor="text-primary-white"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex lg:flex-row flex-col justify-start items-center gap-0 lg:gap-4">
          {/* img */}
          <div className="w-full order-1 lg:order-2 flex-2 flex flex-row justify-center items-center">
            <div
              className={cn(
                "w-[95%] h-60 lg:max-h-120 rounded-md mt-8",
                isLoadingDataProduk && "skeleton",
              )}
            >
              {!isLoadingDataProduk && isExistData && (
                <img
                  src={dataProduk?.data?.img}
                  alt="gambar produk"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* content two */}
          <div className="w-full lg:flex-3 order-2 lg:order-1 flex flex-col justify-start items-start gap-4 mt-8">
            {/* nama */}
            {isLoadingDataProduk ? (
              <div className="w-40 h-7.5 skeleton" />
            ) : (
              isExistData && (
                <div className="flex flex-row justify-start items-start gap-4">
                  {keyUpdate !== "nama" ? (
                    <>
                      <h3 className="text-xl lg:text-2xl text-base-content font-semibold">
                        {dataProduk?.data?.nama}
                      </h3>

                      {/* button pencil */}
                      <BtnUpdate
                        handleKeyUpdate={handleKeyUpdate}
                        value="nama"
                      />
                    </>
                  ) : (
                    <CardForm
                      handleResetForm={handleResetForm}
                      handleSubmit={handleSubmit}
                      onSubmit={onSubmit}
                      isPending={isPendingUpdateProduk}
                    >
                      {/* input text */}
                      <div className="w-80">
                        <InputTextNonIcon
                          register={register("nama")}
                          name="nama"
                          label="Nama Produk"
                          placeholder="Masukan nama produk"
                          errorMessage={errors?.nama?.message}
                          xs
                          required
                          defaultValue={dataProduk?.data?.nama}
                        />
                      </div>
                    </CardForm>
                  )}
                </div>
              )
            )}

            {/* lanjutkan membuat form pada setiap data detail */}

            {/* kode produk */}
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              {isLoadingDataProduk ? (
                <div className="w-40 h-7.5 skeleton" />
              ) : (
                <>
                  {/* sm */}
                  <div className="flex flex-col justify-start items-start lg:hidden gap-1.5">
                    {/* label */}
                    <span className="text-xs font-medium text-base-content/60">
                      Kode Produk
                    </span>

                    {/* value */}
                    <span className="text-sm font-medium text-base-content">
                      {dataProduk?.data?.kode}
                    </span>
                  </div>

                  {/* lg */}
                  <div className="w-full hidden flex-row gap-3 justify-start items-start lg:flex">
                    {/* label */}
                    <div className="flex-1 flex flex-row justify-between items-center">
                      <span className="text-sm font-medium text-base-content/60">
                        Kode Produk
                      </span>
                      <span className="text-sm font-medium text-base-content/60">
                        :
                      </span>
                    </div>

                    {/* value */}
                    <div className="flex-4 flex flex-row justify-start items-center gap-3">
                      {keyUpdate !== "kode" ? (
                        <>
                          <span className="text-sm font-medium text-base-content">
                            {dataProduk?.data?.kode}
                          </span>

                          {/* button pencil */}
                          <BtnUpdate
                            handleKeyUpdate={handleKeyUpdate}
                            value="kode"
                          />
                        </>
                      ) : (
                        <CardForm
                          handleResetForm={handleResetForm}
                          handleSubmit={handleSubmit}
                          onSubmit={onSubmit}
                          isPending={isPendingUpdateProduk}
                          btnAksiPosition="top"
                        >
                          {/* input text */}
                          <div className="w-80">
                            <InputTextNonIcon
                              register={register("kode")}
                              name="kode"
                              placeholder="Masukan kode produk"
                              errorMessage={errors?.kode?.message}
                              required
                              defaultValue={dataProduk?.data?.kode}
                              xs
                            />
                          </div>
                        </CardForm>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* kategori produk */}
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              {isLoadingDataProduk ? (
                <div className="w-40 h-7.5 skeleton" />
              ) : (
                isExistData && (
                  <>
                    {/* sm */}
                    <div className="flex flex-col justify-start items-start lg:hidden gap-1.5">
                      {/* label */}
                      <span className="text-xs font-medium text-base-content/60">
                        Kategori
                      </span>

                      {/* value */}
                      <span className="text-sm font-medium  text-base-content">
                        {dataProduk?.data?.kategori.nama}
                      </span>
                    </div>

                    {/* lg */}
                    <div className="w-full hidden flex-row gap-3 justify-start items-start lg:flex">
                      {/* label */}
                      <div className="flex-1 flex flex-row justify-between items-center">
                        <span className="text-sm font-medium text-base-content/60">
                          Kategori
                        </span>
                        <span className="text-sm font-medium text-base-content/60">
                          :
                        </span>
                      </div>

                      {/* value */}
                      <div className="flex-4 flex flex-row justify-start items-center gap-2">
                        {keyUpdate !== "kategoriId" ? (
                          <>
                            <span className="text-sm font-medium text-base-content">
                              {dataProduk?.data?.kategori?.nama}
                            </span>

                            <BtnUpdate
                              handleKeyUpdate={handleKeyUpdate}
                              value="kategoriId"
                            />
                          </>
                        ) : (
                          <CardForm
                            handleResetForm={handleResetForm}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdateProduk}
                            btnAksiPosition="top"
                          >
                            {/* input text */}
                            <div className="w-80">
                              <InputChoose<UpdateProdukType>
                                controller={kategoriController}
                                chooseList={
                                  dataKategoriForChoose?.data
                                    ? dataKategoriForChoose.data.map(
                                        (item) => ({
                                          value: item.id,
                                          label: item.nama,
                                        }),
                                      )
                                    : []
                                }
                                required
                                isLoading={isLoadingKategoriForChoose}
                                placeholder="Pilih kategori"
                                xs
                              />
                            </div>
                          </CardForm>
                        )}
                      </div>
                    </div>
                  </>
                )
              )}
            </div>

            {/* line */}
            <div className="w-full h-px rounded-full bg-base-content/20 my-1" />

            {/* content harga  */}
            <div className="w-full flex flex-row justify-between gap-2 items-start">
              {isLoadingDataProduk ? (
                <>
                  <div className="flex-1 h-20 skeleton" />
                  <div className="flex-1 h-20 skeleton" />
                </>
              ) : (
                isExistData && (
                  <>
                    {/* harga jual */}
                    <div className="flex-1 min-h-20 rounded-md bg-emerald-100 py-2 px-4 gap-2 flex flex-col justify-start items-start">
                      {/* label */}
                      <div className="w-full flex flex-row justify-between items-center">
                        <span className="text-xs text-base-content">
                          Harga Jual
                        </span>

                        {/* button */}
                        <BtnUpdate
                          handleKeyUpdate={handleKeyUpdate}
                          value="hargaJual"
                        />
                      </div>

                      {/* harga */}
                      {keyUpdate !== "hargaJual" ? (
                        <>
                          <span className="text-lg font-semibold text-emerald-600">
                            {formatRupiah(dataProduk?.data?.hargaJual ?? 0)}
                          </span>
                        </>
                      ) : (
                        <CardForm
                          handleResetForm={handleResetForm}
                          handleSubmit={handleSubmit}
                          onSubmit={onSubmit}
                          isPending={isPendingUpdateProduk}
                          btnAksiPosition="top"
                        >
                          {/* input text */}
                          <div className="w-50">
                            <InputPrice<UpdateProdukType>
                              controller={hargaJualController}
                              placeholder="harga jual produk"
                              xs
                              required
                            />
                          </div>
                        </CardForm>
                      )}
                    </div>

                    {/* harga beli */}
                    <div className="flex-1 min-h-20 rounded-md bg-indigo-100 py-2 px-4 gap-2 flex flex-col justify-start items-start">
                      {/* label */}
                      <div className="w-full flex flex-row justify-between items-center">
                        <span className="text-xs text-base-content">
                          Harga Beli
                        </span>

                        {/* button */}
                        <BtnUpdate
                          handleKeyUpdate={handleKeyUpdate}
                          value="hargaBeli"
                        />
                      </div>

                      {/* harga */}
                      {keyUpdate !== "hargaBeli" ? (
                        <>
                          <span className="text-lg font-semibold text-indigo-600">
                            {formatRupiah(dataProduk?.data?.hargaBeli ?? 0)}
                          </span>
                        </>
                      ) : (
                        <CardForm
                          handleResetForm={handleResetForm}
                          handleSubmit={handleSubmit}
                          onSubmit={onSubmit}
                          isPending={isPendingUpdateProduk}
                          btnAksiPosition="top"
                        >
                          {/* input text */}
                          <div className="w-50">
                            <InputPrice<UpdateProdukType>
                              controller={hargaBeliController}
                              placeholder="harga beli produk"
                              xs
                              required
                            />
                          </div>
                        </CardForm>
                      )}
                    </div>
                  </>
                )
              )}
            </div>

            {isLoadingDataProduk ? (
              <div className="w-full flex flex-col justify-start items-start gap-5 border border-base-content/10 card px-3 py-4 mt-4">
                {Array.from({ length: 4 }, (_, idx) => (
                  <div key={idx} className="skeleton w-full h-8" />
                ))}
              </div>
            ) : (
              isExistData && (
                <>
                  {/* content stock */}
                  <div className="w-full flex flex-col justify-start items-start gap-5 border border-base-content/10 card px-3 py-4 mt-4">
                    {/* stok saat ini */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <Box className="size-5 text-base-content" />
                      </div>

                      {/* label and value */}
                      <div
                        className={cn(
                          "w-full flex flex-row justify-between pb-3 border-b border-base-content/10",
                          keyUpdate === "stok" ? "items-start" : "items-center",
                        )}
                      >
                        {/* label */}
                        <span className="text-xs lg:text-sm text-base-content/90 text-medium">
                          Stok Saat Ini
                        </span>

                        {/* stok */}
                        {keyUpdate !== "stok" ? (
                          <div className="flex flex-row justify-end items-center gap-4">
                            <span
                              className={cn(
                                "text-xs lg:text-sm font-medium",
                                generateColorForStok(
                                  dataProduk?.data?.stok ?? 0,
                                  dataProduk?.data?.stokMinimum ?? 0,
                                ),
                              )}
                            >
                              {dataProduk?.data?.stok}
                            </span>

                            {/* btn update */}
                            <div className="border-l hidden lg:block border-base-content/30 pl-4">
                              <BtnUpdate
                                handleKeyUpdate={handleKeyUpdate}
                                value="stok"
                              />
                            </div>
                          </div>
                        ) : (
                          <CardForm
                            handleResetForm={handleResetForm}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdateProduk}
                            btnAksiPosition="top"
                          >
                            {/* input text */}
                            <div className="w-40">
                              <InputNumber
                                register={register("stok", {
                                  valueAsNumber: true,
                                })}
                                name="stok"
                                placeholder="Stok produk"
                                errorMessage={errors?.stok?.message}
                                required
                                defaultValue={dataProduk?.data?.stok}
                                xs
                              />
                            </div>
                          </CardForm>
                        )}
                      </div>
                    </div>

                    {/* isi per box */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <Box className="size-5 text-warning" />
                      </div>

                      {/* label and value */}
                      <div
                        className={cn(
                          "w-full flex flex-row justify-between pb-3 border-b border-base-content/10",
                          keyUpdate === "isiPerBox"
                            ? "items-start"
                            : "items-center",
                        )}
                      >
                        {/* label */}
                        <span className="text-xs lg:text-sm text-base-content/90 text-medium">
                          Isi Per Box
                        </span>

                        {/* stok */}
                        {keyUpdate !== "isiPerBox" ? (
                          <div className="flex flex-row justify-end items-center gap-4">
                            <span className={"text-xs lg:text-sm font-medium"}>
                              {dataProduk?.data?.isiPerBox}
                            </span>

                            {/* btn update */}
                            <div className="border-l hidden lg:block border-base-content/30 pl-4">
                              <BtnUpdate
                                handleKeyUpdate={handleKeyUpdate}
                                value="isiPerBox"
                              />
                            </div>
                          </div>
                        ) : (
                          <CardForm
                            handleResetForm={handleResetForm}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdateProduk}
                            btnAksiPosition="top"
                          >
                            {/* input text */}
                            <div className="w-40">
                              <InputNumber
                                register={register("isiPerBox", {
                                  valueAsNumber: true,
                                })}
                                name="isiPerBox"
                                placeholder="Isi Per Box"
                                errorMessage={errors?.isiPerBox?.message}
                                required
                                defaultValue={dataProduk?.data?.isiPerBox}
                                xs
                              />
                            </div>
                          </CardForm>
                        )}
                      </div>
                    </div>

                    {/* stok minimun */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <TriangleAlert className="size-5 text-warning" />
                      </div>

                      {/* label and value */}
                      <div
                        className={cn(
                          "w-full flex flex-row justify-between pb-3 border-b border-base-content/10",
                          keyUpdate === "stokMinimum"
                            ? "items-start"
                            : "items-center",
                        )}
                      >
                        {/* label */}
                        <span className="text-xs lg:text-sm text-base-content/90 text-medium">
                          Stok Minimum
                        </span>

                        {/* stok */}
                        {keyUpdate !== "stokMinimum" ? (
                          <div className="flex flex-row justify-end items-center gap-4">
                            <span className={"text-xs lg:text-sm font-medium"}>
                              {dataProduk?.data?.stokMinimum}
                            </span>

                            {/* btn update */}
                            <div className="border-l hidden lg:block border-base-content/30 pl-4">
                              <BtnUpdate
                                handleKeyUpdate={handleKeyUpdate}
                                value="stokMinimum"
                              />
                            </div>
                          </div>
                        ) : (
                          <CardForm
                            handleResetForm={handleResetForm}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            isPending={isPendingUpdateProduk}
                            btnAksiPosition="top"
                          >
                            {/* input text */}
                            <div className="w-40">
                              <InputNumber
                                register={register("stokMinimum", {
                                  valueAsNumber: true,
                                })}
                                name="stokMinimum"
                                placeholder="Isi Per Box"
                                errorMessage={errors?.stokMinimum?.message}
                                required
                                defaultValue={dataProduk?.data?.stokMinimum}
                                xs
                              />
                            </div>
                          </CardForm>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* content status */}
                  <div className="w-full flex flex-col justify-start items-start gap-5 border border-base-content/10 card px-3 py-4 mt-2">
                    {/* is active */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <CircleCheck className="size-5 text-base-content" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs  lg:text-sm text-base-content/90 text-medium">
                          Status Produk
                        </span>

                        {/* stok */}
                        {dataProduk?.data?.isActive === true ? (
                          <div className="flex flex-row justify-center items-center px-2.5 py-0.5 bg-emerald-100 gap-1 rounded-full">
                            {/* label */}
                            <span className="text-[0.7rem] text-emerald-600">
                              Aktif
                            </span>

                            <div
                              aria-label="success"
                              className="status status-success status-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-row justify-center items-center px-2.5 py-0.5 bg-rose-100 gap-1 rounded-full">
                            {/* label */}
                            <span className="text-[0.7rem] text-rose-600">
                              Tidak Aktif
                            </span>

                            <div
                              aria-label="success"
                              className="status status-error status-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* di buat */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <CalendarDays className="size-5 text-emerald-600" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs lg:text-sm text-base-content/90 text-medium">
                          Dibuat
                        </span>

                        {/* tanggal */}
                        <span
                          className={cn(
                            "text-[0.7rem] lg:text-sm text-base-content",
                          )}
                        >
                          {formatTanggalPanjang(
                            dataProduk?.data?.createdAt ?? "",
                          )}
                        </span>
                      </div>
                    </div>

                    {/* di ubah */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <div className="h-full flex flex-row justify-start items-center">
                        <Clock className="size-5 text-info" />
                      </div>

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs lg:text-sm text-base-content/90 text-medium">
                          Diubah
                        </span>

                        {/* tanggal */}
                        <span
                          className={cn(
                            "text-[0.7rem] lg:text-sm text-base-content",
                          )}
                        >
                          {formatTanggalPanjang(
                            dataProduk?.data?.updatedAt ?? "",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// card form
type CardFormProps = {
  handleSubmit: UseFormHandleSubmit<UpdateProdukType>;
  onSubmit: (data: UpdateProdukType) => Promise<void>;
  children: ReactNode;
  handleResetForm: () => void;
  isPending?: boolean;
  btnAksiPosition?: "top";
};
const CardForm: FC<CardFormProps> = ({
  children,
  handleResetForm,
  handleSubmit,
  onSubmit,
  isPending,
  btnAksiPosition,
}) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="hidden h-14 lg:flex flex-row justify-start items-center gap-3"
    >
      {/* input text */}
      {children}

      {/* button aksi */}
      <div
        className={cn(
          "flex h-full flex-row justify-start  gap-2",
          btnAksiPosition === "top" ? "items-start mt-2" : "items-end mb-2",
        )}
      >
        {/* button close */}
        <button
          type="button"
          className={cn(
            "text-primary-white btn-sm btn btn-error",
            isPending && "disabled:bg-error disabled:opacity-50",
          )}
          onClick={() => handleResetForm()}
          disabled={isPending}
        >
          <X className="size-3" />
        </button>

        {/* button submit */}
        <button
          type="submit"
          className={cn(
            "text-primary-white btn-sm btn btn-success",
            isPending && "disabled:bg-success",
          )}
          disabled={isPending}
        >
          {isPending ? (
            <div className="loading loading-xs" />
          ) : (
            <SendHorizonal className="size-3" />
          )}
        </button>
      </div>
    </form>
  );
};

// button update

type BtnUpdateProps = {
  handleKeyUpdate: (value: string) => void;
  value: string;
};

const BtnUpdate: FC<BtnUpdateProps> = ({ handleKeyUpdate, value }) => {
  return (
    <div className="tooltip hidden lg:block" data-tip="ubah">
      <button type="button" onClick={() => handleKeyUpdate(value)}>
        <PencilLineIcon className="size-4 text-info" />
      </button>
    </div>
  );
};

export default ProdukDetail;
