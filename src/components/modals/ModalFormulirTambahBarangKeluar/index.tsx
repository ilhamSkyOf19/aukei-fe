import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmitWithIcon from "../../ui/button/ButtonSubmitWithIcon";
import InputNumber from "../../inputs/InputNumber";
import { PackageMinus } from "lucide-react";
import InputSearch from "../../inputs/InputSearch";
import Alert from "../../messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
import useModalFormulirTambahBarangKeluar from "./useModalFormulirTambahBarangKeluar";
import type { CreateBarangKeluarDetailType } from "../../../models/barangKeluarDetail.model";
import CardProdukForChooseInventori from "../../ui/cards/CardProdukForChooseInventori";
import CardProdukForAfterChooseInventori from "../../ui/cards/CardProdukForAfterChooseInventori";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
};

const ModalFormulirTambahBarangKeluar: FC<Props> = ({
  modalRef,
  handleCloseModal,
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
    produkChoose,
    handleDeleteValueProdukId,
    alert,
    hargaModalSatuanController,
    isPendingBarangKeluarDetail,
    jumlahStokController,
  } = useModalFormulirTambahBarangKeluar({
    handleCloseModal,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal lg:hidden">
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
          <div className="w-full flex flex-col rounded-2xl md:rounded-xl justify-start items-start">
            <TitleModalFormulir
              title="Formulir Barang Keluar"
              keterangan={`Formulir untuk menambah Barang Keluar`}
              withIcon={{
                icon: PackageMinus,
              }}
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
                    "absolute bg-base-100 w-full z-40 rounded-lg top-full grid transition-all duration-300 ease-in-out",
                    activeComponentChooseProduk
                      ? "grid-rows-[1fr] pb-2.5"
                      : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-y-scroll scrollbar-thin">
                    <div
                      className={cn(
                        "w-full flex flex-col h-40 rounded-lg px-2.5 py-4 gap-2",
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
                <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
                  <p className="text-xs font-medium text-base-content">
                    Daftar Pilihan Barang:
                  </p>
                  <CardProdukForAfterChooseInventori
                    data={produkChoose}
                    handleDeleteValueProdukId={handleDeleteValueProdukId}
                    customWidth="w-full"
                  />
                </div>
              )}
            </div>

            {/* input jumlah perbox */}
            <div className="w-full flex flex-row justify-start items-center">
              <InputNumber<CreateBarangKeluarDetailType>
                controller={jumlahStokController}
                label="Jumlah Stok"
                placeholder="Jumlah Stok"
                required
                max={9999999999}
              />
            </div>

            {/* harga modal satuan */}
            <div className="w-full flex flex-row justify-start items-center">
              <InputNumber<CreateBarangKeluarDetailType>
                controller={hargaModalSatuanController}
                label="Harga Modal Satuan"
                placeholder="Harga Modal Satuan"
                required
              />
            </div>

            {/* button submit */}
            <div className="w-full flex flex-row justify-end items-end gap-4 mt-2">
              <ButtonCloseText handleClose={handleCloseModal} label="Batal" />

              <ButtonSubmitWithIcon
                label="Tambah Barang Keluar"
                isLoading={isPendingBarangKeluarDetail}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirTambahBarangKeluar;
