import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { Save } from "lucide-react";
import InputSearch from "../../inputs/InputSearch";
import useModalUbahProdukMasuk from "./useModalUbahProdukMasuk";
import type { StatusInventoriType } from "../../../types/constant.type";
import Alert from "../../messages/Alert";
import { ALERT_CONFIG_BARANG_MASUK_DETAIL } from "../../../types/alert.types";
import InputNumber from "../../inputs/InputNumber";
import type { UpdateBarangMasukDetailType } from "../../../models/barangMasukDetail.model";
import InputPrice from "../../inputs/InputPrice";
import CardProdukForChooseInventori from "../../ui/cards/CardProdukForChooseInventori";
import CardProdukForAfterChooseInventori from "../../ui/cards/CardProdukForAfterChooseInventori";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  idBarangMasuk?: number;
  dataUpdate: {
    produk?: {
      id: number;
      nama: string;
      kode: string;
      img: string;
      stok: number;
    };
    jumlahBox: number;
    hargaBeli: number;
  };
  status?: StatusInventoriType;
};

const ModalUbahProdukMasuk: FC<Props> = ({
  modalRef,
  handleCloseModal,
  idBarangMasuk,
  status,
  dataUpdate,
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

    isPendingBarangMasukDetail,

    alert,
    jumlahBoxController,
    hargaBeliController,
  } = useModalUbahProdukMasuk({
    idBarangMasuk,
    status,
    handleCloseModal,
    dataUpdate,
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
              title="Formulir Barang Masuk"
              keterangan={`Formulir untuk mengganti Produk Barang Masuk`}
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
                    Ganti Produk
                  </label>
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

            {/* jumlah box  */}
            <div className="w-full lg:hidden">
              <InputPrice<UpdateBarangMasukDetailType>
                controller={hargaBeliController}
                label="Harga Beli"
                placeholder="Harga beli"
                max={1000000}
                required
              />
              <InputNumber<UpdateBarangMasukDetailType>
                controller={jumlahBoxController}
                label="Jumlah Box"
                placeholder="Jumlah Box"
                max={1000000}
                required
              />
            </div>

            {/* button submit */}
            <div className="w-full flex flex-row justify-end items-end gap-4 mt-2">
              <ButtonCloseText handleClose={handleCloseModal} label="Batal" />

              <ButtonWithIcon
                typeButton="submit"
                icon={Save}
                label="Simpan"
                isLoading={isPendingBarangMasukDetail}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalUbahProdukMasuk;
