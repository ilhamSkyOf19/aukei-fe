import { type FC, type RefObject } from "react";

import { PackagePlus } from "lucide-react";

import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import DataEmpty from "../../messages/DataEmpty";

import { formatRupiah } from "../../../helpers/helpers";

import InputSearch from "../../inputs/InputSearch";
import FilterKategori from "../../filters/Kategori";
import useFormulirTambahStockOpname from "../../FormulirTambahStockOpname/useFormulirTambahStockOpname";
import ProductRow from "../../FormulirTambahStockOpname/ProductRow";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
  isOwner: boolean;
  produkChooseIds: number[];
};

const ModalFormulirTambahProdukStockOpname: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleSetToast,
  handleSetAlert,
  isOwner,
  produkChooseIds,
}) => {
  const {
    dataProduk,
    isLoadingDataProduk,

    control,
    fields,

    handleToggleProduct,

    isAllChecked,
    handleToggleSelectAll,

    handleSubmit,

    isPendingStockOpnameDetail,

    errors,

    containerRef,

    loadMoreRef,

    handleKategori,

    kategori,

    setSearch,

    isFetchingNextPage,
  } = useFormulirTambahStockOpname({
    handleCloseModal,
    handleSetToast,
    handleSetAlert,
    produkChooseIds,
  });

  const TOTAL_COLUMN = 8;

  const colSpan = isOwner ? TOTAL_COLUMN : TOTAL_COLUMN - 1;

  return (
    <dialog
      ref={modalRef}
      id="modal-formulir-tambah-stock-opname"
      className="modal"
    >
      <div
        className="
          modal-box
          w-11/12
          h-[95vh]
          max-w-6xl
          bg-base-200
          dark:border
          dark:border-base-content/10
          scrollbar-thin
          flex
          flex-col
        "
      >
        {/* HEADER */}
        <div className="w-full flex flex-row justify-start items-center shrink-0">
          <TitleModalFormulir
            title="Formulir Stock Opname"
            keterangan="Pilih produk dan sesuaikan stok fisik untuk melakukan stock opname"
            withIcon={{
              icon: PackagePlus,
            }}
          />
        </div>

        {/* filter */}
        <div className="w-full flex flex-col lg:flex-row justify-start items-start gap-2.5 mt-2.5">
          <div className="w-full lg:w-70">
            <InputSearch handleSearch={setSearch} withLabel />
          </div>

          {/* kategori */}
          <FilterKategori
            setKategori={handleKategori}
            value={kategori}
            customWidth="w-full lg:w-50"
          />
        </div>

        {/* TABLE */}
        <div
          ref={containerRef}
          className="
            w-full
            flex-1
            overflow-auto
            rounded-2xl
            md:rounded-xl
            border
            border-base-content/10
            mt-4
            scrollbar-thin
          "
        >
          <table className="table table-xs lg:table-sm table-zebra table-pin-rows ">
            <thead>
              <tr className="h-9.5 bg-base-200 text-[0.7rem] ">
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={isAllChecked}
                    onChange={handleToggleSelectAll}
                    disabled={isLoadingDataProduk || isPendingStockOpnameDetail}
                  />
                </th>

                <th className="hidden lg:block">No</th>

                <th>Produk</th>

                {isOwner && <th>Harga Modal</th>}

                <th>Stok Sistem</th>

                <th>Stok Fisik</th>

                <th>Selisih</th>

                <th>Penyesuaian</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingDataProduk ? (
                Array.from({
                  length: 4,
                }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={colSpan}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : dataProduk !== undefined && dataProduk.length > 0 ? (
                <>
                  {dataProduk.map((produk, index) => {
                    if (produk === null || produk === undefined) return null;

                    // produk choose
                    const produkIsChoose = produkChooseIds.some(
                      (id) => id === produk?.id,
                    );

                    const fieldIndex = fields.findIndex(
                      (field) => field.produkId === produk?.id,
                    );

                    const checked = fieldIndex !== -1;

                    /**
                     * Produk belum dipilih.
                     */
                    if (!checked) {
                      return (
                        <tr
                          key={produk?.id}
                          className="h-12 text-[0.7rem] text-base-content"
                        >
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={false}
                              onChange={() => handleToggleProduct(produk)}
                              disabled={
                                isPendingStockOpnameDetail || produkIsChoose
                              }
                            />
                          </td>

                          <td className="hidden lg:block">{index + 1}</td>

                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-8 h-8">
                                  <img
                                    src={produk.img}
                                    alt="Foto Produk"
                                    loading="lazy"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col justify-start items-start">
                                <p className="font-medium">{produk.nama}</p>

                                <p className="text-base-content/60">
                                  {produk.kode ?? "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {isOwner && (
                            <td className="whitespace-nowrap">
                              {formatRupiah(produk.hargaModalRataRata ?? 0)}
                            </td>
                          )}

                          <td className="font-medium">{produk.stok ?? 0}</td>

                          <td>
                            <span className="text-base-content/40">-</span>
                          </td>

                          <td>
                            <span className="text-base-content/40">0</span>
                          </td>

                          <td>-</td>
                        </tr>
                      );
                    }

                    /**
                     * Produk sudah dipilih.
                     */
                    const produkError = errors.details?.[fieldIndex]?.produkId;

                    return (
                      <ProductRow
                        key={produk.id}
                        produk={produk}
                        index={fieldIndex}
                        control={control}
                        checked={checked}
                        isOwner={isOwner}
                        isPending={isPendingStockOpnameDetail}
                        handleToggleProduct={handleToggleProduct}
                        error={produkError?.message}
                      />
                    );
                  })}

                  {/* trigger infinite scroll */}
                  <tr>
                    <td colSpan={colSpan}>
                      <div
                        ref={loadMoreRef}
                        className="col-span-full w-full flex flex-row justify-center items-center py-3 min-h-10"
                      >
                        {isFetchingNextPage && (
                          <div className="loading loading-md" />
                        )}
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={colSpan}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Produk Tidak Tersedia"
                        description="Belum ada data produk yang dapat ditampilkan saat ini."
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="w-full flex flex-row justify-end items-end gap-4 mt-4 shrink-0">
          <ButtonCloseText
            handleClose={handleCloseModal}
            label="Batal"
            disabled={isPendingStockOpnameDetail}
          />

          <ButtonWithIcon
            icon={PackagePlus}
            label="Simpan"
            isLoading={isPendingStockOpnameDetail}
            handleBtn={handleSubmit}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirTambahProdukStockOpname;
