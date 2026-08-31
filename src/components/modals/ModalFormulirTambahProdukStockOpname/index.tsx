import { type FC, type RefObject } from "react";
import { PackagePlus } from "lucide-react";

import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";

import InputSearch from "../../inputs/InputSearch";
import InputNumber from "../../inputs/InputNumber";
import InputChoose from "../../inputs/InputChoose";

import CardProdukForChooseInventori from "../../ui/cards/CardProdukForChooseInventori";
import CardProdukForAfterChooseInventori from "../../ui/cards/CardProdukForAfterChooseInventori";

import { cn } from "../../../utils/cn";

import type { CreateStockOpnameDetailType } from "../../../models/stockOpnameDetail.model";
import {
  ALERT_CONFIG_STOCK_OPNAME_DETAIL,
  type Alert as AlertType,
} from "../../../types/alert.types";
import useModalFormulirTambahProdukStockOpname from "./useModalFormulirTambahProdukStockOpname";
import Alert from "../../messages/Alert";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
  alert?: AlertType | null;
};

const ModalFormulirTambahProdukStockOpname: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleSetToast,
  handleSetAlert,
  alert,
}) => {
  const {
    handleSubmit,
    onSubmit,

    wrapperRef,

    handleSearch,
    inputSearchRef,

    handleCloseActiveComponentChooseProduk,
    handleShowActiveComponentChooseProduk,

    errors,

    activeComponentChooseProduk,

    isLoadingProdukForChoose,
    dataProdukForChoose,

    handleSetValueProdukId,
    handleDeleteValueProdukId,

    produkChoose,

    stokFisikController,
    jenisChooseController,

    isPendingStockOpnameDetail,
  } = useModalFormulirTambahProdukStockOpname({
    handleCloseModal,
    handleSetToast,
    handleSetAlert,
  });

  return (
    <dialog
      ref={modalRef}
      id="modal-formulir-tambah-stock-opname"
      className="modal lg:hidden"
    >
      {alert && (
        <Alert
          alert={alert.id !== null}
          isAnimationOut={alert.isAnimationOut || false}
          label={ALERT_CONFIG_STOCK_OPNAME_DETAIL[alert.type].message}
        />
      )}

      <div className="modal-box w-11/12 h-[80vh] max-w-5xl bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin">
        <div className="w-full flex flex-col rounded-2xl md:rounded-xl justify-start items-start">
          {/* TITLE */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Stock Opname"
              keterangan="Formulir untuk menambah produk Stock Opname"
              withIcon={{
                icon: PackagePlus,
              }}
            />
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-start items-start mt-4 gap-3"
          >
            {/* PRODUK */}
            <div
              ref={wrapperRef}
              className="w-full flex flex-col justify-start items-start gap-2"
            >
              <div className="w-full flex flex-col justify-start items-start gap-2 relative">
                {/* LABEL */}
                <div className="relative">
                  <label className="capitalize text-xs lg:text-sm text-base-content">
                    Cari Produk
                  </label>

                  <span className="absolute -top-1 ml-1 text-error">{"*"}</span>
                </div>

                {/* INPUT SEARCH */}
                <InputSearch
                  ref={inputSearchRef}
                  handleSearch={handleSearch}
                  placeholder="Cari produk nama atau kode"
                  handleOnFocus={handleShowActiveComponentChooseProduk}
                  handleClear={handleCloseActiveComponentChooseProduk}
                  errorMessage={errors.produkId?.message}
                />

                {/* DROPDOWN PRODUK */}
                <div
                  className={cn(
                    "absolute bg-base-100 w-full z-40 rounded-2xl md:rounded-xl shadow-xl top-full grid transition-all duration-300 ease-in-out",
                    activeComponentChooseProduk
                      ? "grid-rows-[1fr] pb-2.5"
                      : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-y-scroll scrollbar-thin">
                    <div className="w-full flex flex-col h-40 px-2.5 py-4 gap-2">
                      {isLoadingProdukForChoose ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                          <div className="loading loading-xl" />
                        </div>
                      ) : dataProdukForChoose?.data &&
                        dataProdukForChoose.data.length > 0 ? (
                        dataProdukForChoose.data.map((item) => (
                          <CardProdukForChooseInventori
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

              {/* PRODUK DIPILIH */}
              {produkChoose !== null && (
                <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
                  <p className="text-xs font-medium text-base-content">
                    Produk yang Dipilih:
                  </p>

                  <CardProdukForAfterChooseInventori
                    key={produkChoose.id}
                    data={produkChoose}
                    handleDeleteValueProdukId={handleDeleteValueProdukId}
                    customWidth="w-full"
                  />
                </div>
              )}
            </div>

            {/* JENIS PENYESUAIAN */}
            <div className="w-full flex flex-col justify-start items-start gap-1">
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

              <span className="text-[0.7rem] text-base-content/70">
                Jenis penyesuaian ketika stok fisik lebih sedikit dari stok
                sistem.
              </span>
            </div>

            {/* STOK FISIK */}
            <div className="w-full">
              <InputNumber<CreateStockOpnameDetailType>
                controller={stokFisikController}
                label="Stok Fisik"
                placeholder="Stok Fisik"
                max={1000000}
                required
              />
            </div>

            {/* BUTTON */}
            <div className="w-full flex flex-row justify-end items-end gap-4 mt-2">
              <ButtonCloseText
                handleClose={handleCloseModal}
                label="Batal"
                disabled={isPendingStockOpnameDetail}
              />

              <ButtonWithIcon
                typeButton="submit"
                icon={PackagePlus}
                label="Tambah Stock Opname"
                isLoading={isPendingStockOpnameDetail}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirTambahProdukStockOpname;
