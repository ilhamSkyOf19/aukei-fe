import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { formatNumber, formatRupiah } from "../../../helpers/helpers";
import { CircleDollarSign, RefreshCcw } from "lucide-react";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import type { ResponseDaftarLaporanProdukDetailByKategoriType } from "../../../models/statistik.model";
import useModalHitungPendapatanProduk from "./useModalHitungPendapatanProduk";
import DataEmpty from "../../messages/DataEmpty";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  dataChooses: ResponseDaftarLaporanProdukDetailByKategoriType[];
  kategori: string;
};

const ModalHitungPendapatanProduk: FC<Props> = ({
  modalRef,
  handleCloseModal,
  dataChooses,
  kategori,
}) => {
  const {
    handleHitungProduk,
    hasilHitung,
    hitungType,
    setHitungType,
    handleReset,
  } = useModalHitungPendapatanProduk({
    dataChooses,
    handleCloseModal,
  });
  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div
        className={cn(
          "modal-box max-w-4xl lg:w-3/4 rounded-xl max-h-[95vh] bg-base-200 dark:border dark:border-base-content/10",
        )}
      >
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Hitung Pendapatan Produk"
              keterangan={`Hitung Pendapatan Produk ${kategori}`}
              withIcon={{
                icon: CircleDollarSign,
              }}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row justify-start items-start gap-2.5 md:gap-4 mt-4">
            {/* daftar produk yang di pilih  */}
            <div className="flex-1 h-full flex flex-col justify-start items-start gap-2.5">
              <span className="text-xs font-semibold text-base-content">
                Daftar Produk yang di pilih
              </span>
              <div
                className={cn(
                  " overflow-y-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex scrollbar-thin",
                  dataChooses.length > 8 && " h-[65vh]",
                )}
              >
                <table className="table table-xs lg:table-sm table-zebra table-pin-rows">
                  <thead>
                    <tr className="h-10 bg-base-200 text-[0.7rem]">
                      <th>No</th>
                      <th>Nama</th>
                      <th>Qty</th>
                      <th>Omzet</th>
                      <th>Laba</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataChooses.length > 0 ? (
                      dataChooses.map((item, index) => (
                        <tr
                          key={item.id}
                          className={cn(
                            "transition-all duration-75 ease-in-out h-10 text-[0.625rem] text-base-content",
                          )}
                        >
                          <td>{index + 1}</td>

                          <td className="font-semibold">{item.nama}</td>

                          <td>{formatNumber(item.totalQtyTerjual)}</td>

                          <td>{formatRupiah(item.totalOmzet)}</td>

                          <td>{formatRupiah(item.totalLaba)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>
                          <div className="w-full h-full flex flex-col justify-center items-center">
                            <DataEmpty
                              title="Data Kategori Tidak Tersedia"
                              description="Belum ada data kategori yang dapat ditampilkan saat ini."
                              xs
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* form */}
            <div className="flex-1 flex flex-col justify-start items-start gap-2.5">
              <span className="text-xs font-semibold text-base-content">
                Hitung
              </span>

              <div className="w-full flex flex-row justify-between items-start gap-2.5">
                <div className="flex flex-row justify-start items-start gap-2.5">
                  {/* button */}
                  <button
                    type="button"
                    className={cn(
                      "px-4 py-2.5 rounded-2xl lg:rounded-xl text-xs border border-custom-secondary  transition-all duration-75 ease-in-out",
                      hitungType === "OMZET"
                        ? "bg-custom-secondary text-white"
                        : "hover:bg-custom-secondary hover:text-white",
                    )}
                    onClick={() => setHitungType("OMZET")}
                  >
                    Omzet
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "px-4 py-2.5 rounded-2xl lg:rounded-xl text-xs border border-custom-secondary  transition-all duration-75 ease-in-out",
                      hitungType === "LABA"
                        ? "bg-custom-secondary text-white"
                        : "hover:bg-custom-secondary hover:text-white",
                    )}
                    onClick={() => setHitungType("LABA")}
                  >
                    Laba
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "px-4 py-2.5 rounded-2xl lg:rounded-xl text-xs border border-custom-secondary  transition-all duration-75 ease-in-out",
                      hitungType === "SEMUA"
                        ? "bg-custom-secondary text-white"
                        : "hover:bg-custom-secondary hover:text-white",
                    )}
                    onClick={() => setHitungType("SEMUA")}
                  >
                    Semua
                  </button>
                </div>

                {/* button */}
                <ButtonWithIcon
                  icon={RefreshCcw}
                  label="Hitung"
                  bgColor="bg-info"
                  textColor="text-primary-white"
                  handleBtn={handleHitungProduk}
                />
              </div>

              <span className="text-xs font-semibold text-base-content mt-4">
                Hasil Hitung
              </span>
              <div className="w-full flex flex-col justify-start items-start gap-4">
                {/* card hasil hitung omzet */}
                <div className="w-full flex flex-col justify-start items-start gap-1.5 p-2.5 border rounded-2xl md:rounded-xl">
                  <span className="text-xs font-semibold text-base-content">
                    Total Omzet
                  </span>
                  {hitungType === "OMZET" || hitungType === "SEMUA" ? (
                    <span className="text-sm font-semibold text-base-content">
                      {formatRupiah(hasilHitung?.totalOmzet ?? 0)}
                    </span>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-1.5 p-2.5 border rounded-2xl md:rounded-xl">
                  <span className="text-xs font-semibold text-base-content">
                    Total Laba
                  </span>
                  {hitungType === "LABA" || hitungType === "SEMUA" ? (
                    <span className="text-sm font-semibold text-base-content">
                      {formatRupiah(hasilHitung?.totalLaba ?? 0)}
                    </span>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* hadnle close */}
        <div className="w-full flex flex-row justify-end items-center mt-2.5">
          <ButtonCloseText
            handleClose={() => {
              (handleCloseModal(), handleReset());
            }}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ModalHitungPendapatanProduk;
