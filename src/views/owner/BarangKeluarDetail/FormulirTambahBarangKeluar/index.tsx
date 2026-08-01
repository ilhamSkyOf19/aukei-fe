import { type FC } from "react";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";
import InputNumber from "../../../../components/inputs/InputNumber";
import ButtonSubmitWithIcon from "../../../../components/ui/button/ButtonSubmitWithIcon";
import useFormulirTambahBarangKeluar from "./useFormulirTambahBarangKeluar";
import type { CreateBarangKeluarDetailType } from "../../../../models/barangKeluarDetail.model";
import InputPrice from "../../../../components/inputs/InputPrice";
import ModalFormulirTambahBarangKeluar from "../../../../components/modals/ModalFormulirTambahBarangKeluar";
import FormCariProdukInventori from "../../../../components/forms/FormCariProdukInventori";
import CardProdukForAfterChooseInventori from "../../../../components/ui/cards/CardProdukForAfterChooseInventori";

type Props = {
  totalBarang: number;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
};
const FormulirTambahBarangKeluar: FC<Props> = ({
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
    <div
      className={cn("w-full flex flex-col justify-start items-center gap-2")}
    >
      <div className="w-full lg:hidden flex flex-row justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <p className="text-md font-semibold text-base-content">
            Daftar Barang Keluar
          </p>
          <p className="text-xs px-3 py-1 rounded-2xl md:rounded-xl bg-gray-300">
            {totalBarang} barang
          </p>
        </div>

        {/* button add */}
        <ButtonWithIcon
          handleBtn={() => handleShowModalFormulirTambahBarangKeluar()}
        />
      </div>

      {/* form for lg */}
      <div className="hidden lg:flex flex-col justify-start items-start min-h-30 w-full rounded-2xl md:rounded-xl shadow-xs dark:border dark:border-base-content/10 bg-base-100 p-6">
        {/* title */}
        <div className="w-full flex flex-row justify-start items-center">
          <h2 className="text-base-content text-sm font-semibold">
            Tambah Barang Keluar
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
              label="Tambah Barang Keluar"
              isLoading={isPendingBarangKeluarDetail}
            />
          </div>
        </form>

        {/* card produk choose */}
        {produkChoose && (
          <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
            <p className="text-xs font-medium text-base-content">
              Daftar Pilihan Barang
            </p>

            <div className="w-full grid grid-cols-4 gap-2.5">
              <CardProdukForAfterChooseInventori
                data={produkChoose}
                handleDeleteValueProdukId={handleDeleteValueProdukId}
              />
            </div>
          </div>
        )}
      </div>

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahBarangKeluar
        modalRef={modalFormulirTambahBarangKeluarRef}
        handleCloseModal={handleCloseModalFormulirTambahBarangKeluar}
      />
    </div>
  );
};

export default FormulirTambahBarangKeluar;
