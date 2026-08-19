import {
  Box,
  CalendarDays,
  CircleCheck,
  Clock,
  PencilLineIcon,
  RefreshCcw,
  SendHorizonal,
  Trash,
  Trash2Icon,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  formatNumber,
  formatRupiah,
  generateColorForStok,
} from "../../../helpers/helpers";
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
import InputImg from "../../../components/inputs/InputImg";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_PRODUK_DETAIL } from "../../../types/toast.type";
import ModalDelete from "../../../components/modals/ModalDelete";
import ButtonInline from "../../../components/ui/button/ButtonInline";
import useProdukDetail from "./useProdukDetail";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import ButtonText from "../../../components/ui/button/ButtonText";
import ModalGenerateHargaJual from "../../../components/modals/ModalGenerateHargaJual";
import ModalAlert from "../../../components/modals/ModalAlert";

const ProdukDetail = () => {
  // call use
  const {
    handleRedirectFormulir,
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
    imgController,
    toast,
    handleCloseModalDelete,
    handleDeleteProduk,
    handleShowModalDelete,
    isPendingDeleteProduk,
    modalDeleteRef,
    isiPerBoxController,
    stokMinimumController,
    handelUpdateIsActive,
    isPendingUpdateIsActive,
    dataModalGenerateHargaJual,
    handleCloseModalGenerateHargaJual,
    handleShowModalGenerateHargaJual,
    modalGenerateHargaJualRef,
    handleSetToast,

    dataModalFailedDelete,
    handleCloseModalFailedDelete,
    modalFailedDeleteRef,
  } = useProdukDetail();

  return (
    <main className="w-full flex flex-col justify-start items-start px-2.5">
      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_PRODUK_DETAIL[toast.type].message}
          color={TOAST_CONFIG_PRODUK_DETAIL[toast.type].color}
        />
      )}

      <div className="w-full bg-base-100 rounded-2xl md:rounded-xl border border-transparent dark:border-base-content/10 flex flex-col justify-start items-start p-2.5 md:p-4 mt-2.5 relative">
        {/* header */}
        <div className="w-full flex flex-row justify-center items-center gap-2">
          {/* button back */}
          <div className="flex flex-1 flex-row justify-start items-center">
            <ButtonBackText link="/dashboard/produk" />
          </div>

          <div className="flex flex-1 flex-row justify-center items-center">
            {/* title */}
            <h2 className="text-xs lg:text-base text-center font-semibold text-base-content">
              Informasi Detail Produk
            </h2>
          </div>

          {/* aksi */}
          <div className="flex flex-1 flex-row justify-end items-center">
            {/* button update */}
            <div className="hidden lg:block">
              {isLoadingDataProduk ? (
                <div className="w-20 h-9 skeleton" />
              ) : (
                <ButtonWithIcon
                  icon={Trash}
                  label="Hapus"
                  handleBtn={() => handleShowModalDelete()}
                  bgColor="bg-error"
                  textColor="text-primary-white"
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex lg:flex-row flex-col justify-start items-center gap-0 lg:gap-4">
          {/* img */}
          <div className="w-full order-1 lg:order-2 flex-2 flex flex-row lg:flex-col lg:gap-6 justify-center items-center">
            {keyUpdate !== "img" ? (
              <>
                <div
                  className={cn(
                    "w-[85%] h-65 lg:max-h-120 rounded-md mt-8",
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

                {/* button update */}
                <div className="w-full hidden absolute bottom-4 right-4 lg:flex flex-row justify-end items-center">
                  <ButtonText
                    typeButton
                    handleClick={() => handleKeyUpdate("img")}
                    label="Ganti Gambar"
                  />
                </div>
              </>
            ) : (
              <CardForm
                handleResetForm={handleResetForm}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isPending={isPendingUpdateProduk}
                flexColoum
                hAuto
              >
                {/* input text */}
                <div className="w-100 h-80">
                  <InputImg<UpdateProdukType>
                    controller={imgController}
                    name="img"
                    required
                  />
                </div>
              </CardForm>
            )}
          </div>

          {/* content two */}
          <div className="w-full lg:flex-3 order-2 lg:order-1 flex flex-col justify-start items-start gap-2.5 mt-8">
            {/* nama */}
            {isLoadingDataProduk ? (
              <div className="w-40 h-7.5 skeleton" />
            ) : (
              isExistData && (
                <div className="flex flex-row justify-start items-start gap-4">
                  {keyUpdate !== "nama" ? (
                    <>
                      <h3 className="text-xl lg:text-xl text-base-content font-semibold">
                        {dataProduk?.data?.nama}
                      </h3>

                      {/* button pencil */}
                      <ButtonInline
                        handleKeyUpdate={() => handleKeyUpdate("nama")}
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
                        />
                      </div>
                    </CardForm>
                  )}
                </div>
              )
            )}

            {/* kode produk */}
            <div className="flex w-full flex-col justify-start items-start gap-1.5">
              {isLoadingDataProduk ? (
                <div className="w-40 h-7.5 skeleton" />
              ) : (
                <>
                  {/* sm */}
                  <div className="flex flex-col justify-start items-start lg:hidden gap-1.5">
                    {/* label */}
                    <span className="text-xs text-base-content/70">
                      Kode Produk
                    </span>

                    {/* value */}
                    <span className="text-sm font-medium text-base-content">
                      {dataProduk?.data?.kode}
                    </span>
                  </div>

                  {/* lg */}
                  <div className="w-full hidden flex-row gap-2.5 justify-start items-start lg:flex">
                    {/* label */}
                    <div className="flex-1 flex flex-row justify-between items-center">
                      <span className="text-sm text-base-content/70">
                        Kode Produk
                      </span>
                      <span className="text-sm font-medium text-base-content/70">
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
                          <ButtonInline
                            handleKeyUpdate={() => handleKeyUpdate("kode")}
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
                      <span className="text-xs text-base-content/60">
                        Kategori
                      </span>

                      {/* value */}
                      <span className="text-sm font-medium  text-base-content">
                        {dataProduk?.data?.kategori.nama}
                      </span>
                    </div>

                    {/* lg */}
                    <div className="w-full hidden flex-row gap-2.5 justify-start items-start lg:flex">
                      {/* label */}
                      <div className="flex-1 flex flex-row justify-between items-center">
                        <span className="text-sm text-base-content/70">
                          Kategori
                        </span>
                        <span className="text-sm font-medium text-base-content/70">
                          :
                        </span>
                      </div>

                      {/* value */}
                      <div className="flex-4 flex flex-row justify-start items-center gap-2">
                        {keyUpdate !== "kategoriId" ? (
                          <>
                            <span className="text-sm font-medium text-base-content">
                              {dataProduk?.data?.kategori.nama}
                            </span>

                            <ButtonInline
                              handleKeyUpdate={() =>
                                handleKeyUpdate("kategoriId")
                              }
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

            {/* content harga  */}
            <div className="w-full flex flex-row justify-between gap-2.5 items-stretch border-t border-base-content/30 pt-2">
              {isLoadingDataProduk ? (
                <>
                  <div className="flex-1 h-20 skeleton" />
                  <div className="flex-1 h-20 skeleton" />
                </>
              ) : (
                isExistData && (
                  <>
                    {/* harga jual */}
                    <div className="flex-1 min-h-20 rounded-md bg-emerald-50 border border-emerald-500 py-2 px-2.5 gap-2 flex flex-col justify-start items-start">
                      {/* label */}
                      <div className="w-full flex flex-row justify-between items-center">
                        <span className="text-xs text-base-content">
                          Harga Jual Satuan
                        </span>

                        {/* button */}
                        <ButtonInline
                          handleKeyUpdate={() => handleKeyUpdate("hargaJual")}
                        />
                      </div>

                      {/* harga */}
                      {keyUpdate !== "hargaJual" ? (
                        <div className="flex flex-row justify-start items-center gap-4">
                          <span className="text-lg font-semibold text-emerald-500">
                            {formatRupiah(dataProduk?.data?.hargaJual ?? 0)}
                          </span>

                          <div
                            className="tooltip"
                            data-tip="kalkulasi harga jual"
                          >
                            <ButtonWithIcon
                              icon={RefreshCcw}
                              bgColor="bg-info"
                              textColor="text-primary-white"
                              noLabel
                              handleBtn={() =>
                                handleShowModalGenerateHargaJual(undefined, {
                                  produk: { id: dataProduk?.data?.id },
                                })
                              }
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
                    <div className="flex-1 min-h-20 rounded-md bg-indigo-50 border border-indigo-500 py-2 px-2.5 gap-2 flex flex-col justify-start items-start">
                      {/* label */}
                      <div className="w-full flex flex-row justify-between items-center">
                        <span className="text-xs text-base-content">
                          Harga Beli Satuan
                        </span>

                        {/* button */}
                        <ButtonInline
                          handleKeyUpdate={() => handleKeyUpdate("hargaBeli")}
                        />
                      </div>

                      {/* harga */}
                      {keyUpdate !== "hargaBeli" ? (
                        <>
                          <span className="text-lg font-semibold text-indigo-500">
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
                <div className="flex flex-col md:flex-row w-full justify-between items-stretch gap-2.5">
                  {/* content stock */}
                  <div className="w-full flex flex-col justify-start items-start gap-5 border border-base-content/10 rounded-2xl md:rounded-xl p-2.5 mt-2.5">
                    {/* stok saat ini */}
                    <div className="w-full flex flex-row justify-between items-start gap-2.5">
                      {/* icon */}
                      <Box className="size-5 text-base-content" />

                      {/* label and value */}
                      <div
                        className={cn(
                          "w-full flex flex-row justify-between pb-3 border-b border-base-content/10",
                          keyUpdate === "stok" ? "items-start" : "items-center",
                        )}
                      >
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Stok Saat Ini
                        </span>

                        <span
                          className={cn(
                            "text-xs lg:text-sm font-medium",
                            generateColorForStok(
                              dataProduk?.data?.stok ?? 0,
                              dataProduk?.data?.stokMinimum ?? 0,
                            ),
                          )}
                        >
                          {formatNumber(
                            (dataProduk?.data?.stok ?? 0).toString(),
                          )}
                        </span>
                      </div>
                    </div>

                    {/* isi per box */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <Box className="size-5 text-warning" />

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
                        <span className="text-xs text-base-content/90 text-medium">
                          Isi Per Box
                        </span>

                        {/* stok */}
                        {keyUpdate !== "isiPerBox" ? (
                          <div className="flex flex-row justify-end items-center gap-4">
                            <span className={"text-xs font-medium"}>
                              {formatNumber(
                                (dataProduk?.data?.isiPerBox ?? 0).toString(),
                              )}
                            </span>

                            {/* btn update */}
                            <div className="border-l hidden lg:block border-base-content/30 pl-4">
                              <ButtonInline
                                handleKeyUpdate={() =>
                                  handleKeyUpdate("isiPerBox")
                                }
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
                            <div className="w-15">
                              <InputNumber<UpdateProdukType>
                                controller={isiPerBoxController}
                                placeholder="Masukkan isi per box produk"
                                required
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
                      <TriangleAlert className="size-5 text-warning" />

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
                        <span className="text-xs text-base-content/90 text-medium">
                          Stok Minimum
                        </span>

                        {/* stok */}
                        {keyUpdate !== "stokMinimum" ? (
                          <div className="flex flex-row justify-end items-center gap-4">
                            <span className={"text-xs font-medium"}>
                              {formatNumber(
                                (dataProduk?.data?.stokMinimum ?? 0).toString(),
                              )}
                            </span>

                            {/* btn update */}
                            <div className="border-l hidden lg:block border-base-content/30 pl-4">
                              <ButtonInline
                                handleKeyUpdate={() =>
                                  handleKeyUpdate("stokMinimum")
                                }
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
                            <div className="w-15">
                              <InputNumber<UpdateProdukType>
                                controller={stokMinimumController}
                                placeholder="Masukkan stok minimum produk"
                                required
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
                      <CircleCheck
                        className={cn(
                          "size-5",
                          dataProduk?.data?.isActive
                            ? "text-emerald-600"
                            : "text-rose-600",
                        )}
                      />

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Status Produk
                        </span>

                        {/* is active */}
                        {isPendingUpdateIsActive ? (
                          <div className="loading loading-xs" />
                        ) : (
                          <input
                            type="checkbox"
                            checked={dataProduk?.data?.isActive}
                            className="toggle toggle-success toggle-sm"
                            onChange={() => {
                              if (dataProduk?.data) {
                                handelUpdateIsActive({
                                  id: dataProduk?.data?.id,
                                  status: !dataProduk?.data?.isActive,
                                });
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* di buat */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <CalendarDays className="size-5 text-emerald-600" />

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Dibuat
                        </span>

                        {/* tanggal */}
                        <span className={cn("text-xs text-base-content")}>
                          {formatTanggalPanjang(
                            dataProduk?.data?.createdAt ?? "",
                          )}
                        </span>
                      </div>
                    </div>

                    {/* di ubah */}
                    <div className="w-full flex flex-row justify-between items-start gap-3">
                      {/* icon */}
                      <Clock className="size-5 text-info" />

                      {/* label and value */}
                      <div className="w-full flex flex-row justify-between items-center pb-3 border-b border-base-content/10">
                        {/* label */}
                        <span className="text-xs text-base-content/90 text-medium">
                          Diubah
                        </span>

                        {/* tanggal */}
                        <span className={cn("text-xs text-base-content")}>
                          {formatTanggalPanjang(
                            dataProduk?.data?.updatedAt ?? "",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* button aksi for mobile device */}
            <div className="lg:hidden w-full flex flex-row justify-end items-center gap-2 mt-2">
              {/* button delete */}
              {isLoadingDataProduk ? (
                <>
                  <div className="w-20 h-8 skeleton" />
                  <div className="w-20 h-8 skeleton" />
                </>
              ) : (
                <>
                  {/* button delete */}
                  <ButtonWithIcon
                    icon={Trash2Icon}
                    label="Hapus"
                    handleBtn={() => handleShowModalDelete()}
                    bgColor="bg-error"
                    textColor="text-primary-white"
                  />

                  {/* button update */}
                  <ButtonWithIcon
                    icon={PencilLineIcon}
                    label="Ubah"
                    handleBtn={() => handleRedirectFormulir()}
                    bgColor="bg-info"
                    textColor="text-primary-white"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={() => handleDeleteProduk()}
        isLoadingDelete={isPendingDeleteProduk}
        bigTitle={`Apakah anda yakin ingin menghapus data "${dataProduk?.data?.nama}" ini?`}
      />

      {/* modal generate harga jual */}
      <ModalGenerateHargaJual
        modalRef={modalGenerateHargaJualRef}
        handleCloseModal={handleCloseModalGenerateHargaJual}
        handleSetToast={handleSetToast}
        data={{ id: dataModalGenerateHargaJual?.produk.id }}
        noInfo
      />

      {/* modal alert */}
      <ModalAlert
        modalRef={modalFailedDeleteRef}
        handleCloseModal={handleCloseModalFailedDelete}
        bigTitle={dataModalFailedDelete?.titleMessage ?? ""}
        smallTitle={dataModalFailedDelete?.description ?? ""}
      />
    </main>
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
  flexColoum?: boolean;
  hAuto?: boolean;
};
const CardForm: FC<CardFormProps> = ({
  children,
  handleResetForm,
  handleSubmit,
  onSubmit,
  isPending,
  btnAksiPosition,
  flexColoum,
  hAuto,
}) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "hidden  lg:flex justify-start gap-3",
        flexColoum ? "flex-col items-end" : "flex-row items-center",
        hAuto ? "h-auto" : "h-14",
      )}
    >
      {/* input text */}
      {children}

      {/* button aksi */}
      <div
        className={cn(
          "flex h-full justify-start gap-2",
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

export default ProdukDetail;
