import { type FC } from "react";
import useFormulirTambahBarangMasuk from "./useFormulirTambahBarangMasuk";
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
import type { CreateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import ButtonSubmitWithIcon from "../../../../components/ui/button/ButtonSubmitWithIcon";
import ModalFormulirTambahBarangMasuk from "../../../../components/modals/ModalFormulirTambahBarangMasuk";

type Props = {
  status?: StatusInventoriType;
  totalBarang: number;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
};
const FormulirTambahBarangMasuk: FC<Props> = ({
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
    isPendingBarangMasukDetail,
    onSubmit,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    jumlahBoxController,
    inputSearchRef,
    handleCloseModalFormulirTambahBarang,
    handleShowModalFormulirTambahBarang,
    modalFormulirTambahBarangRef,
  } = useFormulirTambahBarangMasuk({
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

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahBarangMasuk
        modalRef={modalFormulirTambahBarangRef}
        handleCloseModal={handleCloseModalFormulirTambahBarang}
      />
    </div>
  );
};

export default FormulirTambahBarangMasuk;
