import type { FC, RefObject } from "react";
import { HatGlasses } from "lucide-react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonText from "../../ui/button/ButtonText";
import useModalPilihanProduk from "./useModalPilihanProduk";
import InputSearch from "../../inputs/InputSearch";
import FilterKategori from "../../filters/Kategori";
import CardSimpleProduk from "../../inputs/CardSimpleProduk";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  detailId?: number;
  existProduks?: { produkId: number }[];
  enabled?: boolean;
  pelangganId?: number;
  transactionId?: number;
  transactionIdForAddProdukForUpdateTransaksi?: number;
};

const ModalPilihanProduk: FC<Props> = ({
  modalRef,
  handleCloseModal,
  detailId,
  existProduks,
  enabled,
  pelangganId,
  transactionId,
  transactionIdForAddProdukForUpdateTransaksi,
}) => {
  const {
    dataProduk,
    handleKategori,
    isLoadingProduk,
    kategori,
    loadMoreRef,
    produkContainerRef,
    setSearch,
    isExistDataProduk,
    existingProdukIds,
    handleSetProdukBooking,
    handleUpdateBooking,
    isPendingUpdateBooking,
    bookingProduk,
    isFetchingNextPage,
    handleCloseModalAndResetExisting,
  } = useModalPilihanProduk({
    enabled,
    pelangganId,
    handleCloseModal,
    detailId,
    existProduks,
    transactionId,
    transactionIdForAddProdukForUpdateTransaksi,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box h-[90vh] w-11/12 max-w-5xl rounded-2xl bg-base-100 dark:border dark:border-base-content/10">
        <div className="w-full h-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Pilih Produk`}
              keterangan={`Pilih untuk mengganti produk.`}
              withIcon={{
                icon: HatGlasses,
              }}
            />
          </div>

          <div className="flex flex-col flex-2 min-h-0 h-full gap-2.5 mt-4 md:mt-0">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2.5 md:px-2.5">
              <div className="w-full md:flex-2">
                <InputSearch
                  handleSearch={setSearch}
                  placeholder="Cari produk"
                />
              </div>

              {/* filter */}
              <FilterKategori
                setKategori={handleKategori}
                customWidth="w-full md:w-35"
                noLabel
                value={kategori}
                enabled={enabled}
              />
            </div>

            <div
              ref={produkContainerRef}
              className="flex flex-col w-full min-h-0 h-full overflow-y-auto scrollbar-thin gap-2.5 md:p-2.5"
            >
              {isLoadingProduk ? (
                Array.from({ length: 5 }, (_, i) => i + 1).map((item) => (
                  <div
                    key={item}
                    className=" shrink-0 flex rounded-xl flex-row justify-between items-center gap-2.5 p-2.5 bg-primary-white shadow-sm w-full h-14 skeleton"
                  />
                ))
              ) : isExistDataProduk ? (
                <>
                  {dataProduk.map((item) => {
                    const terpilih =
                      bookingProduk?.produkId === item.id ||
                      existingProdukIds.some((id) => id === item.id);

                    return (
                      <CardSimpleProduk
                        key={item.id}
                        item={item}
                        terpilih={terpilih}
                        handleGantiProduk={() =>
                          handleSetProdukBooking({
                            produkId: item.id,
                            quantity: 1,
                            diskon: 0,
                            hargaJual: item.hargaJual,
                          })
                        }
                      />
                    );
                  })}
                  {/* trigger infinite scroll */}
                  <div
                    ref={loadMoreRef}
                    className="col-span-full w-full flex flex-row justify-center items-center py-3 min-h-10"
                  >
                    {isFetchingNextPage && (
                      <div className="loading loading-md" />
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <span className="text-sm font-medium">
                    Produk tidak ditemukan
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-row justify-end items-end gap-2.5 pt-4">
            <ButtonCloseText handleClose={handleCloseModalAndResetExisting} />
            <ButtonText
              label="Simpan"
              isLoading={isPendingUpdateBooking}
              handleClick={() => handleUpdateBooking()}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalPilihanProduk;
