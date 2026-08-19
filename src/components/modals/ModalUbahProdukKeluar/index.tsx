import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import InputSearch from "../../inputs/InputSearch";
import type { StatusInventoriType } from "../../../types/constant.type";
import Alert from "../../messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
import useModalUbahProdukKeluar from "./useModalUbahProdukKeluar";
import InputPrice from "../../inputs/InputPrice";
import type { UpdateBarangKeluarDetailType } from "../../../models/barangKeluarDetail.model";
import InputNumber from "../../inputs/InputNumber";
import CardProdukForAfterChooseInventori from "../../ui/cards/CardProdukForAfterChooseInventori";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import CardProdukForChooseInventori from "../../ui/cards/CardProdukForChooseInventori";
import { Save } from "lucide-react";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  jumlahStok?: number;
  dataUpdate: {
    hargaModalSatuan?: number;
    jumlahStok?: number;
    produkId?: number;
  };
  status?: StatusInventoriType;
  idBarangKeluar?: number;
};

const ModalUbahProdukKeluar: FC<Props> = ({
  modalRef,
  handleCloseModal,
  status,
  idBarangKeluar,
  dataUpdate: { hargaModalSatuan, jumlahStok, produkId },
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

    isPendingBarangKeluarDetail,

    alert,
    hargaModalSatuanController,
    jumlahStokController,
  } = useModalUbahProdukKeluar({
    idBarangKeluar,
    status,
    dataUpdate: {
      hargaModalSatuan,
      jumlahStok,
      produkId,
    },
    handleCloseModal,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_BARANG_MASUK_DETAIL[alert.type].message}
        />
      )}

      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl  h-[80vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Barang Keluar"
              keterangan={`Formulir untuk mengganti Produk Barang Keluar`}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-start items-start mt-4 gap-2"
          >
            {/* produk */}
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
                    "absolute bg-base-100 w-full shadow-xl z-10 rounded-2xl md:rounded-xl top-full grid transition-all duration-300 ease-in-out mt-1",
                    activeComponentChooseProduk
                      ? "grid-rows-[1fr] pb-2.5"
                      : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-y-auto scrollbar-thin">
                    <div
                      className={cn(
                        "w-full flex flex-col h-40 rounded-lg p-4 gap-2",
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
              {produkChoose !== null && (
                <div className="w-full flex flex-col justify-start items-start gap-2 mt-2">
                  <p className="text-xs font-medium">Daftar Pilihan Barang:</p>
                  <CardProdukForAfterChooseInventori
                    data={produkChoose}
                    handleDeleteValueProdukId={handleDeleteValueProdukId}
                    customWidth="w-full"
                  />
                </div>
              )}
            </div>

            {/* harga modal satuan */}
            <div className="w-full lg:hidden">
              <InputPrice<UpdateBarangKeluarDetailType>
                controller={hargaModalSatuanController}
                label="Harga Modal Satuan"
                placeholder="Harga Modal Satuan"
                required
              />
            </div>

            {/* jumlah stok */}
            <div className="w-full lg:hidden">
              <InputNumber<UpdateBarangKeluarDetailType>
                controller={jumlahStokController}
                label="Jumlah Stok"
                placeholder="Jumlah Stok"
                required
                max={1000000}
              />
            </div>

            {/* button submit */}
            <div className="w-full flex flex-row justify-end items-end gap-4 mt-2">
              <ButtonCloseText
                disabled={isPendingBarangKeluarDetail}
                handleClose={handleCloseModal}
                label="Batal"
              />

              <ButtonWithIcon
                icon={Save}
                typeButton="submit"
                label="Simpan"
                isLoading={isPendingBarangKeluarDetail}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalUbahProdukKeluar;
