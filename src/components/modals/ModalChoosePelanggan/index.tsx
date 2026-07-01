import { type FC, type RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputSearch from "../../inputs/InputSearch";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import { ChevronRight, UserPlus, UserX } from "lucide-react";
import { formatNumberPhone } from "../../../helpers/helpers";
import useModalChoosePelanggan from "./useModalChoosePelanggan";
import Pagination from "../../ui/Pagination";
import DataEmpty from "../../messages/DataEmpty";
import type { IPelangganType } from "../../../models/pelanggan.model";
import Avatar from "../../ui/Avatar";
import ModalFormulirPelanggan from "../ModalFormulirPelanggan";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleShowModal: () => void;
  handleChoose: (data: Pick<IPelangganType, "id" | "nama" | "noWa">) => void;
};
const ModalChoosePelanggan: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleShowModal,
  handleChoose,
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
  } = useModalChoosePelanggan({
    handleCloseModalChoosePelanggan: handleCloseModal,
    handleShowModalChoosePelanggan: handleShowModal,
  });

  return (
    <dialog ref={modalRef} id="my_modal_3" className="modal">
      <div className="modal-box max-h-[90vh] lg:w-2/5 max-w-5xl bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-between items-start">
            <TitleModalFormulir
              title="Pilih Pelanggan"
              keterangan={`Pilih pelanggan yang terdaftar`}
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
              <InputSearch handleSearch={handleSearch} />
            </div>

            <div className="w-55 flex flex-row justify-end items-start">
              {/* btn */}
              <ButtonWithIcon
                icon={UserPlus}
                label="Pelanggan Baru"
                handleBtn={handleShowModalFormulirPelanggan}
              />
            </div>
          </div>

          {/* daftar pelanggan */}
          <div className="w-full flex flex-col justify-start items-start rounded-lg border border-base-content/10 overflow-y-auto scrollbar-thin h-120 mt-4">
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
                  className="w-full flex flex-row justify-between items-center px-4 py-3 border-b border-base-content/10 hover-overlay shrink-0"
                  onClick={() => {
                    handleChoose({
                      id: item.id,
                      nama: item.nama,
                      noWa: item.noWa,
                    });
                    handleCloseModal();
                  }}
                >
                  <div className="flex-2 flex flex-row justify-start items-center gap-4">
                    {/* avatar */}
                    <Avatar index={index} nama={item.nama} />

                    {/* nama and no wa */}
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <span className="text-sm font-medium text-base-content">
                        {item.nama}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {formatNumberPhone(item.noWa.toString())}
                      </span>
                    </div>
                  </div>

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
