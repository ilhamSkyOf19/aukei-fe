import { type FC, type RefObject } from "react";
import { Save } from "lucide-react";

import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import InputNumber from "../../inputs/InputNumber";

import {
  JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE,
  ROLE_INTERNAL_TYPE,
  type RoleInternalType,
  type StatusStockOpnameType,
} from "../../../types/constant.type";
import type { UpdateStockOpnameDetailType } from "../../../models/stockOpnameDetail.model";
import useModalFormulirUbahProdukStokOpname from "./useModalFormulirUbahProdukStokOpname";
import InputSearch from "../../inputs/InputSearch";
import { cn } from "../../../utils/cn";
import CardProdukForChooseInventori from "../../ui/cards/CardProdukForChooseInventori";
import CardProdukForAfterChooseInventori from "../../ui/cards/CardProdukForAfterChooseInventori";
import InputChoose from "../../inputs/InputChoose";
import { formatNumber } from "../../../helpers/helpers";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;

  status?: StatusStockOpnameType;

  dataUpdate: {
    detailId?: number;
    stokFisik?: number;
    jenisPenyesuaian?: UpdateStockOpnameDetailType["jenisPenyesuaian"];
    produkId?: number;
  };
  role?: RoleInternalType;

  dataChooseIds?: number[];
};

const ModalFormulirUbahProdukStockOpname: FC<Props> = ({
  modalRef,
  handleCloseModal,
  status,
  dataUpdate,
  role,
  dataChooseIds,
}) => {
  const {
    handleSubmit,
    inputSearchRef,
    isDirty,
    isPendingUpdate,
    jenisPenyesuaianController,
    stokFisikController,
    onSubmit,
    wrapperRef,
    reset,
    handleSearch,
    activeComponentChooseProduk,
    dataProdukForChoose,
    handleCloseActiveComponentChooseProduk,
    handleDeleteValueProdukId,
    handleSetValueProdukId,
    handleShowActiveComponentChooseProduk,
    produkChoose,
    isLoadingProdukForChoose,
    errors,

    selisih,
  } = useModalFormulirUbahProdukStokOpname({
    dataUpdate,
    handleCloseModal,
    status,
  });

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-11/12 max-w-lg bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Stock Opname"
              keterangan="Formulir untuk mengubah data stock opname produk"
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-start items-start mt-4 gap-4"
          >
            {/* informasi produk */}
            <div
              ref={wrapperRef}
              className="w-full flex flex-col justify-start items-start gap-2"
            >
              <div className="w-full flex flex-col justify-start items-start gap-2 relative">
                {/* label */}
                <div className="relative">
                  <label className="capitalize text-xs lg:text-sm text-base-content">
                    Cari Produk
                  </label>

                  <span className="absolute -top-1 ml-1 text-error">{"*"}</span>
                </div>

                <InputSearch
                  ref={inputSearchRef}
                  handleSearch={handleSearch}
                  placeholder="Cari produk nama atau kode"
                  handleOnFocus={() => handleShowActiveComponentChooseProduk()}
                  handleClear={() => handleCloseActiveComponentChooseProduk()}
                  errorMessage={errors?.produkId?.message}
                />

                {/* modal show data produk for choose */}
                <div
                  className={cn(
                    "absolute bg-base-100 w-full z-40 rounded-2xl md:rounded-xl shadow-xl top-full grid transition-all duration-300 ease-in-out",
                    activeComponentChooseProduk
                      ? "grid-rows-[1fr] pb-2.5"
                      : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-y-scroll scrollbar-thin">
                    <div
                      className={cn(
                        "w-full flex flex-col h-70 px-2.5 py-4 gap-2",
                      )}
                    >
                      {isLoadingProdukForChoose ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                          <div className="loading loading-xl" />
                        </div>
                      ) : dataProdukForChoose?.data &&
                        dataProdukForChoose?.data?.length > 0 ? (
                        dataProdukForChoose?.data?.map((item, _) => (
                          <CardProdukForChooseInventori
                            disabled={
                              dataChooseIds?.some((id) => id === item.id) ||
                              produkChoose?.some(
                                (produk) => produk.id === item.id,
                              )
                            }
                            hargaModal={role === ROLE_INTERNAL_TYPE.OWNER}
                            key={item.id}
                            data={item}
                            handleSetValueProdukId={handleSetValueProdukId}
                          />
                        ))
                      ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                          <p className="text-xs font-medium text-base-content/50">
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
                  <p className="text-xs font-medium text-base-content">
                    Daftar Pilihan Barang:
                  </p>
                  {produkChoose.map((item) => (
                    <CardProdukForAfterChooseInventori
                      hargaModal={role === ROLE_INTERNAL_TYPE.OWNER}
                      key={item.id}
                      data={item}
                      handleDeleteValueProdukId={handleDeleteValueProdukId}
                      customWidth="w-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* stok fisik */}
            <div className="w-full">
              <InputNumber<UpdateStockOpnameDetailType>
                controller={stokFisikController}
                label="Stok Fisik"
                placeholder="Masukkan stok fisik"
                max={1000000}
              />
            </div>

            {/* selisih  */}
            <div className="w-full flex flex-col justify-start items-start gap-1.5">
              {/* label */}
              <span className="capitalize text-xs text-base-content">
                Selisih
              </span>
              <span
                className={cn(
                  "capitalize text-xs text-base-content font-medium",
                  selisih > 0 ? "text-success" : "text-error",
                )}
              >
                {formatNumber(selisih)}
              </span>
            </div>

            {/* jenis penyesuaian */}
            <InputChoose<UpdateStockOpnameDetailType>
              required={false}
              disabled={selisih >= 0}
              placeholder="Jenis Penyesuaian"
              controller={jenisPenyesuaianController}
              chooseList={[
                {
                  label: "Masuk Kerugian",
                  value: JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE.MASUK_KERUGIAN,
                },
                {
                  label: "Tidak Masuk Kerugian",
                  value:
                    JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE.TIDAK_MASUK_KERUGIAN,
                },
              ]}
            />

            {/* button */}
            <div className="w-full flex flex-row justify-end items-end gap-4 mt-2">
              <ButtonCloseText
                disabled={isPendingUpdate}
                handleClose={() => {
                  reset();
                  handleCloseModal();
                }}
                label="Batal"
              />

              <ButtonWithIcon
                typeButton="submit"
                icon={Save}
                label="Simpan"
                isLoading={isPendingUpdate}
                disabled={!isDirty || isPendingUpdate}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirUbahProdukStockOpname;
