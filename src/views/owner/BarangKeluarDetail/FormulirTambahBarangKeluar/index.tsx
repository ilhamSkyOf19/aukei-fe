import { type FC } from "react";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import InputSearch from "../../../../components/inputs/InputSearch";
import { cn } from "../../../../utils/cn";
import { formatRupiah } from "../../../../helpers/helpers";
import { Trash2 } from "lucide-react";
import InputNumber from "../../../../components/inputs/InputNumber";
import ButtonSubmitWithIcon from "../../../../components/ui/button/ButtonSubmitWithIcon";
import useFormulirTambahBarangKeluar from "./useFormulirTambahBarangKeluar";
import type { CreateBarangKeluarDetailType } from "../../../../models/barangKeluarDetail.model";
import InputPrice from "../../../../components/inputs/InputPrice";
import ModalFormulirTambahBarangKeluar from "../../../../components/modals/ModalFormulirTambahBarangKeluar";

type Props = {
  status?: StatusInventoriType;
  totalBarang: number;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
};
const FormulirTambahBarangKeluar: FC<Props> = ({
  status,
  totalBarang,
  handleSetToast,
  handleSetAlert,
}) => {
  const {
    dataProdukForChoose,
    errors,
    handleSearch,
    handleSetValueProdukId,
    handleDeleteValueProdukId,
    handleSubmit,
    isPendingBarangKeluarDetail,
    onSubmit,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    jumlahStokController,
    inputSearchRef,
    handleCloseModalFormulirTambahBarangKeluar,
    handleShowModalFormulirTambahBarangKeluar,
    modalFormulirTambahBarangKeluarRef,
    hargaModalSatuanController,
  } = useFormulirTambahBarangKeluar({
    handleSetToast,
    handleSetAlert,
  });

  return (
    <div className="w-full flex flex-col justify-start items-center gap-2 mt-4 lg:mt-0">
      {/* header for sm */}
      {status === STATUS_INVENTORI_TYPE.DRAFT && (
        <>
          <div className="w-full lg:hidden flex flex-row justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1.5">
              <p className="text-md font-semibold">Daftar Barang Masuk</p>
              <p className="text-xs px-3 py-1 rounded-full bg-gray-300">
                {totalBarang} barang
              </p>
            </div>

            {/* button add */}
            <ButtonWithIcon
              handleBtn={() => handleShowModalFormulirTambahBarangKeluar()}
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
                    handleClear={() => handleCloseActiveComponentChooseProduk()}
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
                                  Harga Beli Saat Ini
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
                {produkChoose !== null && (
                  <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
                    <p className="text-xs font-medium">
                      Daftar Pilihan Barang:
                    </p>
                    <div
                      key={produkChoose.id}
                      className="w-full flex flex-row justify-between items-center hover:bg-custom-primary/50 p-2 rounded-md transition-all duration-100 ease-in-out"
                    >
                      <div className="w-full flex flex-row justify-start items-start gap-2">
                        <div className="flex-2 w-full flex flex-row justify-start items-start gap-4">
                          {/* img */}
                          <div className="w-11 h-11 rounded-md overflow-hidden">
                            <img
                              src={produkChoose.img}
                              alt="foto produk"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* nama */}
                          <div className="flex flex-col justify-start items-start gap-1">
                            <p className="text-sm font-semibold">
                              {produkChoose.nama}
                            </p>
                            <p className="text-xs text-base-content/50 font-medium">
                              {produkChoose.kode}
                            </p>
                          </div>
                        </div>

                        {/* harga beli Saat Ini */}
                        <div className="flex-1 flex flex-col justify-start items-start gap-1">
                          {/* label */}
                          <span className="text-[0.625rem] text-base-content/50">
                            Harga Beli Saat Ini
                          </span>
                          {/* value */}
                          <span className="text-[0.625rem] font-semibold text-base-content">
                            {formatRupiah(produkChoose.hargaBeli)}
                          </span>
                        </div>
                      </div>

                      {/* button trash */}
                      <button
                        type="button"
                        className="p-2 hover-oveerlay rounded-full bg-error text-primary-white"
                        onClick={() => handleDeleteValueProdukId()}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* input harga modal satuan */}
              <div className="flex-1 flex flex-row justify-start items-center">
                <InputPrice<CreateBarangKeluarDetailType>
                  controller={hargaModalSatuanController}
                  label="Harga Modal Satuan"
                  placeholder="Harga Modal Satuan"
                  required
                />
              </div>

              {/* input jumlah stok */}
              <div className="flex-1 flex flex-row justify-start items-center">
                <InputNumber<CreateBarangKeluarDetailType>
                  controller={jumlahStokController}
                  label="Jumlah Stok"
                  placeholder="Jumlah Stok"
                  required
                  max={1000000}
                />
              </div>

              {/* button submit */}
              <div className="flex-1 flex flex-row justify-end items-end h-18">
                <ButtonSubmitWithIcon
                  label="Tambah Barang Masuk"
                  isLoading={isPendingBarangKeluarDetail}
                />
              </div>
            </form>
          </div>
        </>
      )}

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahBarangKeluar
        modalRef={modalFormulirTambahBarangKeluarRef}
        handleCloseModal={handleCloseModalFormulirTambahBarangKeluar}
      />
    </div>
  );
};

export default FormulirTambahBarangKeluar;
