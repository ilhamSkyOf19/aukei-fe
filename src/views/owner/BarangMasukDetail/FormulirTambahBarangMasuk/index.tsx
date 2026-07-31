import { type FC } from "react";
import useFormulirTambahBarangMasuk from "./useFormulirTambahBarangMasuk";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";
import { Trash2 } from "lucide-react";
import InputNumber from "../../../../components/inputs/InputNumber";
import type { CreateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import ButtonSubmitWithIcon from "../../../../components/ui/button/ButtonSubmitWithIcon";
import ModalFormulirTambahBarangMasuk from "../../../../components/modals/ModalFormulirTambahBarangMasuk";
import InputPrice from "../../../../components/inputs/InputPrice";
import FormCariProdukInventori from "../../../../components/forms/FormCariProdukInventori";

type Props = {
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
};
const FormulirTambahBarangMasuk: FC<Props> = ({
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
    hargaBeliController,
  } = useFormulirTambahBarangMasuk({
    handleSetToast,
    handleSetAlert,
  });

  return (
    <div
      className={cn("w-full flex flex-col justify-start items-center gap-2")}
    >
      <div className="w-full lg:hidden flex flex-row justify-between items-center mt-2.5">
        <p className="text-md font-semibold text-base-content">
          Daftar Barang Masuk
        </p>

        {/* button add */}
        <ButtonWithIcon
          handleBtn={() => handleShowModalFormulirTambahBarang()}
        />
      </div>
      {/* form for lg */}
      <div className="hidden lg:flex flex-col justify-start items-start min-h-30 w-full rounded-2xl md:rounded-xl shadow-xs dark:border dark:border-base-content/10 bg-base-100 py-2.5 px-4">
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
          <FormCariProdukInventori
            wrapperRef={wrapperRef}
            handleSearch={handleSearch}
            handleCloseActiveComponentChooseProduk={
              handleCloseActiveComponentChooseProduk
            }
            handleSetValueProdukId={handleSetValueProdukId}
            handleShowActiveComponentChooseProduk={
              handleShowActiveComponentChooseProduk
            }
            inputSearchRef={inputSearchRef}
            activeComponentChooseProduk={activeComponentChooseProduk}
            dataProdukForChoose={dataProdukForChoose}
            error={errors.produkId?.message}
            isLoadingProdukForChoose={isLoadingProdukForChoose}
            isLoadingDataProdukForChoose={isLoadingProdukForChoose}
          />

          {/* input jumlah perbox */}
          <div className="flex-2 gap-4 flex flex-row justify-start items-start">
            <InputPrice<CreateBarangMasukDetailType>
              controller={hargaBeliController}
              label="Harga Beli Custom"
              placeholder="Harga Beli Custom"
              max={1000000}
              caption="Berlaku untuk produk yang dipilih"
            />
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

        {/* card produk choose */}
        {produkChoose.length > 0 && (
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <p className="text-xs font-medium text-base-content">
              Daftar Pilihan Barang
            </p>

            <div className="w-full grid grid-cols-4 gap-2.5">
              {produkChoose.map((item) => (
                <div
                  key={item.id}
                  className="col-span-1 flex flex-row justify-start items-center hover:bg-custom-primary/50 p-2 rounded-2xl md:rounded-xl transition-all duration-100 ease-in-out border border-base-content/10"
                >
                  <div className="w-full flex flex-row justify-start items-center gap-2">
                    <div className="flex-2 w-full flex flex-row justify-start items-start gap-4">
                      {/* img */}
                      <div className="w-11 h-11 rounded-xl overflow-hidden">
                        <img
                          src={item.img}
                          alt="foto produk"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* nama */}
                      <div className="flex flex-col justify-start items-start gap-1">
                        <p className="text-xs font-medium text-base-content">
                          {item.nama}
                        </p>
                        <p className="text-[0.625rem] text-base-content/70 font-medium">
                          {item.kode}
                        </p>
                        <p className="text-[0.625rem] gap-1.5 flex flex-row justify-start items-center text-base-content/70">
                          <span>Stok: </span>
                          <span className="font-medium">
                            {formatNumber(item.stok)}
                          </span>
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
                        {item.hargaBeli >= 1000000
                          ? formatRupiahShort(item.hargaBeli)
                          : formatRupiah(item.hargaBeli)}
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
          </div>
        )}
      </div>

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahBarangMasuk
        modalRef={modalFormulirTambahBarangRef}
        handleCloseModal={handleCloseModalFormulirTambahBarang}
      />
    </div>
  );
};

export default FormulirTambahBarangMasuk;
