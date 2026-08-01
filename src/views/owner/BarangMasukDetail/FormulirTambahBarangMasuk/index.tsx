import { type FC } from "react";
import useFormulirTambahBarangMasuk from "./useFormulirTambahBarangMasuk";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";
import InputNumber from "../../../../components/inputs/InputNumber";
import type { CreateBarangMasukDetailType } from "../../../../models/barangMasukDetail.model";
import ButtonSubmitWithIcon from "../../../../components/ui/button/ButtonSubmitWithIcon";
import ModalFormulirTambahBarangMasuk from "../../../../components/modals/ModalFormulirTambahBarangMasuk";
import InputPrice from "../../../../components/inputs/InputPrice";
import FormCariProdukInventori from "../../../../components/forms/FormCariProdukInventori";
import CardProdukForAfterChooseInventori from "../../../../components/ui/cards/CardProdukForAfterChooseInventori";

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
                <CardProdukForAfterChooseInventori
                  key={item.id}
                  data={item}
                  handleDeleteValueProdukId={handleDeleteValueProdukId}
                />
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
