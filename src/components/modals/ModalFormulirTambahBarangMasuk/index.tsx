import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmitWithIcon from "../../ui/button/ButtonSubmitWithIcon";
import InputNumber from "../../inputs/InputNumber";
import type { CreateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import { PackagePlus, Trash2 } from "lucide-react";
import InputSearch from "../../inputs/InputSearch";
import { formatRupiah } from "../../../helpers/helpers";
import useModalFormulirTambahBarangMasuk from "./useModalFormulirTambahBarangMasuk";
import Alert from "../../messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
import InputPrice from "../../inputs/InputPrice";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
};

const ModalFormulirTambahBarangMasuk: FC<Props> = ({
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
    jumlahBoxController,
    isPendingBarangMasukDetail,
    alert,
    hargaBeliController,
  } = useModalFormulirTambahBarangMasuk({
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
        <div className="w-full flex flex-col rounded-2xl md:rounded-xl justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Barang Masuk"
              keterangan={`Formulir untuk menambah Barang Masuk`}
              withIcon={{
                icon: PackagePlus,
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
                      ? "grid-rows-[1fr]"
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
                          <button
                            type="button"
                            key={item.id}
                            className="w-full flex flex-row justify-between rounded-2xl md:rounded-xl items-start gap-1 hover:bg-custom-primary/50 p-2 transition-all duration-100 ease-in-out border-b border-base-content/10"
                            onClick={() => handleSetValueProdukId(item.id)}
                          >
                            <div className="flex-3 flex flex-row justify-start items-start gap-4">
                              {/* img */}
                              <div className="w-11 shrink-0 h-11 rounded-2xl md:rounded-xl overflow-hidden">
                                <img
                                  src={item.img}
                                  alt="foto produk"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* nama */}
                              <div className="flex flex-col justify-start items-start gap-1">
                                <p className="text-xs text-left font-medium lg:text-sm text-base-content lg:font-semibold">
                                  {item.nama}
                                </p>
                                <p className="text-[0.625rem] font-medium lg:text-xs text-base-content/50 lg:font-semibold">
                                  {item.kode}
                                </p>
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-start items-start gap-1">
                              {/* label */}
                              <span className="text-[0.625rem] text-base-content/50">
                                Harga Beli
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
              {produkChoose.length > 0 && (
                <div className="w-full flex flex-col justify-start items-start gap-2 mt-4">
                  <p className="text-xs font-medium text-base-content">
                    Daftar Pilihan Barang:
                  </p>
                  {produkChoose.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex flex-row justify-between items-center hover:bg-custom-primary/50 p-2 rounded-2xl md:rounded-xl transition-all duration-100 ease-in-out"
                    >
                      <div className="w-full flex flex-row justify-start items-start gap-2">
                        <div className="flex-2 flex flex-row justify-start items-start gap-4">
                          {/* img */}
                          <div className="w-11 shrink-0 h-11 rounded-2xl md:rounded-xl overflow-hidden">
                            <img
                              src={item.img}
                              alt="foto produk"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* nama */}
                          <div className="flex flex-col justify-start items-start gap-1">
                            <p className="text-xs lg:text-sm font-semibold text-base-content">
                              {item.nama}
                            </p>
                            <p className="text-[0.625rem] lg:text-xs text-base-content/50 font-medium">
                              {item.kode}
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
                            {formatRupiah(item.hargaBeli)}
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
              )}
            </div>

            {/* input jumlah perbox */}
            <div className="w-full mt-2 flex flex-col justify-start items-center">
              <InputPrice<CreateBarangMasukDetailType>
                controller={hargaBeliController}
                label="Harga Beli Custom"
                placeholder="Harga Beli Custom"
                caption="Berlaku untuk produk yang dipilih"
              />

              <InputNumber<CreateBarangMasukDetailType>
                controller={jumlahBoxController}
                label="Jumlah Box"
                placeholder="Jumlah Box"
                required
              />
            </div>

            {/* button submit */}
            <div className="w-full flex flex-row justify-end items-end gap-4 mt-2">
              <ButtonCloseText handleClose={handleCloseModal} label="Batal" />

              <ButtonSubmitWithIcon
                label="Tambah Barang Masuk"
                isLoading={isPendingBarangMasukDetail}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirTambahBarangMasuk;
