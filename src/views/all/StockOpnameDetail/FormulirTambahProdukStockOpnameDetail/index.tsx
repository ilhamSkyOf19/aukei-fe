import { type FC } from "react";

import useFormulirTambahProdukStockOpnameDetail from "./useFormulirTambahProdukStockOpnameDetail";

import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";

import InputNumber from "../../../../components/inputs/InputNumber";

import type { CreateStockOpnameDetailType } from "../../../../models/stockOpnameDetail.model";

import FormCariProdukInventori from "../../../../components/forms/FormCariProdukInventori";
import CardProdukForAfterChooseInventori from "../../../../components/ui/cards/CardProdukForAfterChooseInventori";

import { PackagePlus } from "lucide-react";

type Props = {
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
  isGlobalLoading?: boolean;
};

const FormulirTambahProdukStockOpnameDetail: FC<Props> = ({
  handleSetToast,
  handleSetAlert,
  isGlobalLoading,
}) => {
  const {
    dataProdukForChoose,
    errors,
    handleSearch,
    handleSetValueProdukId,
    handleDeleteValueProdukId,
    handleSubmit,
    isPendingStockOpnameDetail,
    onSubmit,
    produkChoose,
    wrapperRef,
    activeComponentChooseProduk,
    handleShowActiveComponentChooseProduk,
    handleCloseActiveComponentChooseProduk,
    isLoadingProdukForChoose,
    stokFisikController,
    inputSearchRef,
  } = useFormulirTambahProdukStockOpnameDetail({
    handleSetToast,
    handleSetAlert,
  });

  return (
    <div
      className={cn("w-full flex flex-col justify-start items-center gap-2")}
    >
      {/* ============================================================ */}
      {/* FORM */}
      {/* ============================================================ */}

      <div className="flex flex-col justify-start items-start min-h-30 w-full rounded-2xl md:rounded-xl shadow-xs dark:border dark:border-base-content/10 bg-base-100 py-2.5 px-4">
        {/* title */}
        <div className="w-full flex flex-row justify-start items-center">
          <h2 className="text-base-content text-sm font-semibold">
            Tambah Produk Stock Opname
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
            hargaModal
          />

          {/* stok fisik */}
          <div className="flex-1">
            <InputNumber<CreateStockOpnameDetailType>
              controller={stokFisikController}
              label="Stok Fisik"
              placeholder="Masukkan Stok Fisik"
              required
              max={1000000}
            />
          </div>

          {/* button submit */}
          <div className="flex-1 flex flex-row justify-end items-end h-18">
            <ButtonWithIcon
              icon={PackagePlus}
              disabled={isGlobalLoading}
              typeButton="submit"
              label="Tambah Produk"
              isLoading={isPendingStockOpnameDetail}
            />
          </div>
        </form>

        {/* ============================================================ */}
        {/* PRODUK CHOOSE */}
        {/* ============================================================ */}

        {produkChoose && (
          <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
            <p className="text-xs font-medium text-base-content">
              Produk yang Dipilih
            </p>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <CardProdukForAfterChooseInventori
                data={produkChoose}
                handleDeleteValueProdukId={handleDeleteValueProdukId}
                customWidth="w-90"
                hargaModal
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulirTambahProdukStockOpnameDetail;
