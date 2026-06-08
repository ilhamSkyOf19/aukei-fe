import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmitWithIcon from "../../ui/button/ButtonSubmitWithIcon";
import { Trash2 } from "lucide-react";
import InputSearch from "../../inputs/InputSearch";
import { formatRupiah } from "../../../helpers/helpers";
import useModalGantiProdukKeluar from "./useModalGantiProdukKeluar";
import type { StatusInventoriType } from "../../../types/constant.type";
import Alert from "../../messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  idBarangKeluar?: number;
  status?: StatusInventoriType;
};

const ModalGantiProdukKeluar: FC<Props> = ({
  modalRef,
  handleCloseModal,
  idBarangKeluar,
  status,
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
  } = useModalGantiProdukKeluar({ idBarangKeluar, status, handleCloseModal });

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
                    "absolute bg-base-100 w-full z-40 rounded-lg top-full grid transition-all duration-300 ease-in-out",
                    activeComponentChooseProduk
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-y-scroll scrollbar-thin">
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
                          <button
                            type="button"
                            key={item.id}
                            className="w-full flex flex-row justify-between items-start gap-1 hover:bg-custom-primary/50 p-2 transition-all duration-100 ease-in-out border-b border-base-content/10"
                            onClick={() => handleSetValueProdukId(item.id)}
                          >
                            <div className="flex-2 lg:flex-3 flex flex-row justify-start items-start gap-4">
                              {/* img */}
                              <div className="w-11 shrink-0 h-11 rounded-md overflow-hidden">
                                <img
                                  src={item.img}
                                  alt="foto produk"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* nama */}
                              <div className="flex flex-col justify-start items-start gap-1">
                                <p className="text-xs text-left font-medium lg:text-sm lg:font-semibold">
                                  {item.nama}
                                </p>
                                <p className="text-[0.625rem] font-medium lg:text-xs text-base-content/50 lg:font-semibold">
                                  {item.kode}
                                </p>
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-start items-start gap-1">
                              {/* label */}
                              <span className="text-[0.625rem] text-left text-base-content/50">
                                Harga Beli Saat Ini
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
                  <p className="text-xs font-medium">Daftar Pilihan Barang:</p>
                  <div className="w-full flex flex-row justify-between items-center hover:bg-custom-primary/50 p-2 rounded-md transition-all duration-100 ease-in-out">
                    <div className="w-full flex flex-row justify-start items-start gap-2">
                      <div className="flex-2 flex flex-row justify-start items-start gap-4">
                        {/* img */}
                        <div className="w-11 shrink-0 h-11 rounded-md overflow-hidden">
                          <img
                            src={produkChoose.img}
                            alt="foto produk"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* nama */}
                        <div className="flex flex-col justify-start produkChooses-start gap-1">
                          <p className="text-xs lg:text-sm font-semibold">
                            {produkChoose.nama}
                          </p>
                          <p className="text-[0.625rem] lg:text-xs text-base-content/50 font-medium">
                            {produkChoose.kode}
                          </p>
                        </div>
                      </div>

                      {/* harga beli */}
                      <div className="flex-1 flex flex-col justify-start items-start gap-1">
                        {/* label */}
                        <span className="text-[0.625rem] text-left text-base-content/50">
                          Harga Beli Saat Ini
                        </span>
                        {/* value */}
                        <span className="text-[0.625rem] font-semibold text-base-content">
                          {formatRupiah(produkChoose.hargaBeli)}
                        </span>
                      </div>
                    </div>

                    {/* button trash */}
                    <button
                      type="button"
                      className="p-2 hover-oveerlay rounded-full bg-error text-primary-white"
                      onClick={() => handleDeleteValueProdukId()}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* button submit */}
            <div className="w-full flex flex-row justify-end items-end gap-4 mt-2">
              <ButtonCloseText handleClose={handleCloseModal} label="Batal" />

              <ButtonSubmitWithIcon
                label="Ganti Barang Keluar"
                isLoading={isPendingBarangKeluarDetail}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalGantiProdukKeluar;
