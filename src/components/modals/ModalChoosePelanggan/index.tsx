import { type FC, type RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputSearch from "../../inputs/InputSearch";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import { ChevronRight, UserRoundPlus, UsersRound, UserX } from "lucide-react";
import { formatNumberPhone } from "../../../helpers/helpers";
import useModalChoosePelanggan from "./useModalChoosePelanggan";
import Pagination from "../../ui/Pagination";
import DataEmpty from "../../messages/DataEmpty";
import Avatar from "../../ui/Avatar";
import ModalFormulirPelanggan from "../ModalFormulirPelanggan";
import { cn } from "../../../utils/cn";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleShowModal: () => void;
  transactionIdFromCart?: number;
};
const ModalChoosePelanggan: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleShowModal,
  transactionIdFromCart,
}) => {
  // call use
  const {
    dataPelanggan,
    handlePage,
    handleSearch,
    isLoadingPelanggan,
    goTo,
    isNext,
    isPrev,
    pages,
    currentPage,
    isExistDataPelanggan,
    modalFormulirPelangganRef,
    handleCloseModalFormulirPelanggan,
    handleShowModalFormulirPelanggan,

    handlePilihPelanggan,
    isPendingPilihPelanggan,
  } = useModalChoosePelanggan({
    handleCloseModalChoosePelanggan: handleCloseModal,
    handleShowModalChoosePelanggan: handleShowModal,
  });

  return (
    <dialog ref={modalRef} id="my_modal_3" className="modal">
      <div
        className={cn(
          "modal-box lg:w-2/4 max-w-5xl rounded-xl bg-base-100 dark:border dark:border-base-content/10 relative flex flex-col justify-start items-center",
          isPendingPilihPelanggan ? "overflow-hidden h-[90vh]" : "max-h-[95vh]",
        )}
      >
        {/* is pending */}
        {isPendingPilihPelanggan && (
          <div className="w-full h-full absolute flex flex-col justify-center items-center z-10">
            <div className="w-full h-full bg-base-100 opacity-50 absolute" />

            {/* loading */}
            <div className="loading loading-lg" />
          </div>
        )}

        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-between items-start">
            <TitleModalFormulir
              title="Pilih Pelanggan"
              keterangan={`Pilih pelanggan yang terdaftar`}
              withIcon={{
                icon: UsersRound,
              }}
            />

            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                handleCloseModal();
                handlePage("1");
                handleSearch("");
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* content */}
        <div className="w-full flex flex-col justify-start items-start mt-6">
          {/* search and btn add */}
          <div className="w-full flex flex-row justify-between items-start gap-2">
            {/* search */}
            <div className="w-full">
              <InputSearch
                handleSearch={handleSearch}
                placeholder="Cari nomor / nama. Contoh: Annas"
              />
            </div>

            <div className="w-55 flex flex-row justify-end items-start">
              {/* btn */}
              <ButtonWithIcon
                icon={UserRoundPlus}
                label="Pelanggan Baru"
                handleBtn={handleShowModalFormulirPelanggan}
              />
            </div>
          </div>

          {/* daftar pelanggan */}
          <div className="w-full flex flex-col justify-start items-start rounded-xl border border-base-content/10 overflow-y-auto scrollbar-thin h-90 mt-4 scrollbar-thumb-custom-secondary">
            {/* card pelanggan */}
            {isLoadingPelanggan ? (
              <div className="w-full flex flex-col justify-start items-start gap-1 p-2">
                {Array.from({ length: 4 }, (_, i) => i).map((_, i) => (
                  <div key={i} className="w-full h-11 skeleton" />
                ))}
              </div>
            ) : isExistDataPelanggan ? (
              dataPelanggan?.data?.data.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className="w-full flex flex-row justify-between items-center px-4 py-2.5 border-b border-base-content/10 hover-overlay shrink-0"
                  onClick={() => {
                    handlePilihPelanggan({
                      pelangganId: item.id,
                      transactionId: transactionIdFromCart,
                    });
                  }}
                >
                  <div className="flex-2 flex flex-row justify-start items-center gap-4">
                    {/* avatar */}
                    <Avatar index={index} nama={item.nama} sm />
                    {/* nama and no wa */}
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <span className="text-xs font-medium text-base-content">
                        {item.nama}
                      </span>
                      <span className="text-[0.7rem] font-medium text-base-content/50">
                        {formatNumberPhone(item.noWa.toString())}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-base-content capitalize">
                    {item.label}
                  </span>

                  <div className="flex-1 flex flex-row justify-end items-center">
                    <ChevronRight className="size-4 text-base-content" />
                  </div>
                </button>
              ))
            ) : (
              <div className="w-full flex flex-row justify-center items-center">
                <DataEmpty
                  iconData={UserX}
                  title="Data Pelanggan Tidak Tersedia"
                  description="Belum ada data pelanggan yang dapat ditampilkan saat ini."
                  xs
                />
              </div>
            )}
          </div>
        </div>

        {/* pagination */}
        <div className="w-full flex flex-row justify-between items-center mt-4">
          {/* informasi */}
          <div className="flex-1 flex flex-row justify-start items-center">
            <p className="text-xs">
              Menampilkan <span>1</span> -{" "}
              <span>{dataPelanggan?.data?.data?.length}</span> dari{" "}
              <span>{dataPelanggan?.data?.meta.totalData}</span> pelanggan
            </p>
          </div>

          <div className="flex flex-1 flex-row justify-end items-center">
            <Pagination
              currentPage={currentPage}
              goTo={goTo}
              isNext={isNext}
              isPrev={isPrev}
              pages={pages}
              xs
            />
          </div>
        </div>
      </div>

      {/* modal formulir pelanggan */}
      <ModalFormulirPelanggan
        modalRef={modalFormulirPelangganRef}
        handleCloseModal={handleCloseModalFormulirPelanggan}
      />
    </dialog>
  );
};

export default ModalChoosePelanggan;
