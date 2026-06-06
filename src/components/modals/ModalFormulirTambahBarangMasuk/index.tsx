import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmitWithIcon from "../../ui/button/ButtonSubmitWithIcon";
import InputNumber from "../../inputs/InputNumber";
import type { CreateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import { Trash2 } from "lucide-react";
import type { UseControllerReturn, UseFormHandleSubmit } from "react-hook-form";
import InputSearch from "../../inputs/InputSearch";
import type { InputSearchRef } from "../../../types/ref.type";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleSubmit: UseFormHandleSubmit<CreateBarangMasukDetailType>;
  onSubmit: (data: CreateBarangMasukDetailType) => Promise<void>;
  wrapperRef: RefObject<HTMLDivElement | null>;
  inputSearchRef: RefObject<InputSearchRef | null>;
  handleSearch: (value: string) => void;
  handleShowActiveComponentChooseProduk: () => void;
  handleCloseActiveComponentChooseProduk: () => void;
  errorMessageProdukId?: string;
  activeComponentChooseProduk: boolean;
  isLoadingProdukForChoose: boolean;
  dataProdukForChoose?: ResponseProdukForChooseType[];
  handleSetValueProdukId: (id: number) => void;
  produkChoose: ResponseProdukForChooseType[];
  handleDeleteValueProdukId: (id: number) => void;
  jumlahBoxController: UseControllerReturn<
    CreateBarangMasukDetailType,
    "jumlahBox"
  >;
  isPendingBarangMasukDetail?: boolean;
};

const ModalFormulirTambahBarangMasuk: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleSubmit,
  onSubmit,
  wrapperRef,
  handleSearch,
  inputSearchRef,
  handleCloseActiveComponentChooseProduk,
  handleShowActiveComponentChooseProduk,
  errorMessageProdukId,
  activeComponentChooseProduk,
  isLoadingProdukForChoose,
  dataProdukForChoose,
  handleSetValueProdukId,
  produkChoose,
  handleDeleteValueProdukId,
  jumlahBoxController,
  isPendingBarangMasukDetail,
}) => {
  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal lg:hidden">
      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl  h-[80vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Barang Masuk"
              keterangan={`Formulir untuk menambah Barang Masuk`}
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
                  errorMessage={errorMessageProdukId}
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
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "w-full flex flex-col h-40 rounded-lg shadow-xs border border-base-content/10 p-4 gap-2",
                      )}
                    >
                      {isLoadingProdukForChoose ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                          <div className="loading loading-xl" />
                        </div>
                      ) : dataProdukForChoose &&
                        dataProdukForChoose?.length > 0 ? (
                        dataProdukForChoose?.map((item, _) => (
                          <button
                            type="button"
                            key={item.id}
                            className="w-full flex flex-row justify-start items-start gap-4 hover:bg-custom-primary/50 p-2 rounded-md transition-all duration-100 ease-in-out"
                            onClick={() => handleSetValueProdukId(item.id)}
                          >
                            {/* img */}
                            <div className="w-11 h-11 rounded-md overflow-hidden">
                              <img
                                src={item.img}
                                alt="foto produk"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* nama */}
                            <div className="flex flex-col justify-start items-start gap-1">
                              <p className="text-sm font-semibold">
                                {item.nama}
                              </p>
                              <p className="text-xs text-base-content/50 font-semibold">
                                {item.kode}
                              </p>
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
                  <p className="text-xs font-medium">Daftar Pilihan Barang:</p>
                  {produkChoose.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex flex-row justify-between items-center hover:bg-custom-primary/50 p-2 rounded-md transition-all duration-100 ease-in-out"
                    >
                      <div className="w-full flex flex-row justify-start items-start gap-4">
                        {/* img */}
                        <div className="w-11 h-11 rounded-md overflow-hidden">
                          <img
                            src={item.img}
                            alt="foto produk"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* nama */}
                        <div className="flex flex-col justify-start items-start gap-1">
                          <p className="text-sm font-semibold">{item.nama}</p>
                          <p className="text-xs text-base-content/50 font-semibold">
                            {item.kode}
                          </p>
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
            <div className="w-full flex flex-row justify-start items-center">
              <InputNumber<CreateBarangMasukDetailType>
                controller={jumlahBoxController}
                label="Jumlah Box"
                placeholder="Jumlah Box"
                required
                max={9999999999}
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
