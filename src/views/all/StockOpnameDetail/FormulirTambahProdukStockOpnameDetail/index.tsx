import { type FC } from "react";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";
import FormCariProdukInventori from "../../../../components/forms/FormCariProdukInventori";
import CardProdukForAfterChooseInventori from "../../../../components/ui/cards/CardProdukForAfterChooseInventori";
import { PackagePlus } from "lucide-react";
import useFormulirTambahProdukStockOpnameDetail from "./useFormulirTambahProdukStockOpnameDetail";
import type { CreateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";
import InputChoose from "../../../../components/inputs/InputChoose";
import InputNumber from "../../../../components/inputs/InputNumber";
import ModalFormulirTambahProdukStockOpname from "../../../../components/modals/ModalFormulirTambahProdukStockOpname";
import type { Alert } from "../../../../types/alert.types";

type Props = {
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
  alert?: Alert | null;
  isGlobalLoading?: boolean;
};
const FormulirTambahBarangMasuk: FC<Props> = ({
  handleSetToast,
  handleSetAlert,
  isGlobalLoading,
  alert,
}) => {
  const {
    handleShowModalFormulirTambahBarang,
    activeComponentChooseProduk,
    dataProdukForChoose,
    errors,
    handleCloseActiveComponentChooseProduk,
    handleCloseModalFormulirTambahBarang,
    handleDeleteValueProdukId,
    handleSearch,
    handleSetValueProdukId,
    handleShowActiveComponentChooseProduk,
    handleSubmit,
    inputSearchRef,
    isLoadingProdukForChoose,
    isPendingStockOpnameDetail,
    modalFormulirTambahBarangRef,
    onSubmit,
    produkChoose,
    stokFisikController,
    wrapperRef,
    jenisChooseController,
  } = useFormulirTambahProdukStockOpnameDetail({
    handleSetAlert,
    handleSetToast,
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
            Tambah Stok Opname
          </h2>
        </div>
        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-row justify-start items-start mt-4 gap-8"
        >
          {/* produk */}
          <FormCariProdukInventori
            hargaBeli
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
          />

          {/* input jumlah perbox */}
          <div className="flex-2 gap-4 flex flex-row justify-start items-start">
            <div className="flex flex-col justify-start items-start w-120">
              <InputChoose<CreateStockOpnameDetailType>
                chooseList={[
                  {
                    label: "Masuk Kerugian",
                    value: "MASUK_KERUGIAN",
                  },
                  {
                    label: "Tidak Masuk Kerugian",
                    value: "TIDAK_MASUK_KERUGIAN",
                  },
                ]}
                controller={jenisChooseController}
                label="Jenis Penyesuaian"
                placeholder="Jenis Penyesuaian"
                required={false}
              />

              <span className="text-[0.7rem] text-base-content">
                Jenis penyesuaian ketika stok minus
              </span>
            </div>

            <InputNumber<CreateStockOpnameDetailType>
              controller={stokFisikController}
              label="Stok Fisik"
              placeholder="Stok Fisik"
              max={1000000}
              required
            />
          </div>
          {/* button submit */}
          <div className="flex-1 flex flex-row justify-end items-end h-17">
            <ButtonWithIcon
              icon={PackagePlus}
              disabled={isGlobalLoading}
              typeButton="submit"
              label="Tambah Stok Opname"
              isLoading={isPendingStockOpnameDetail}
            />
          </div>
        </form>

        {/* card produk choose */}
        {produkChoose !== null && (
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <p className="text-xs font-medium text-base-content">
              Daftar Pilihan Barang
            </p>

            <div className="w-full grid grid-cols-4 gap-2.5">
              <CardProdukForAfterChooseInventori
                hargaBeli
                data={produkChoose}
                handleDeleteValueProdukId={handleDeleteValueProdukId}
              />
            </div>
          </div>
        )}
      </div>

      {/* modal formulir barang masuk */}
      <ModalFormulirTambahProdukStockOpname
        modalRef={modalFormulirTambahBarangRef}
        handleCloseModal={handleCloseModalFormulirTambahBarang}
        alert={alert}
        handleSetAlert={handleSetAlert}
        handleSetToast={handleSetToast}
      />
    </div>
  );
};

export default FormulirTambahBarangMasuk;
