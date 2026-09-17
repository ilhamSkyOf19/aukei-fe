import { type FC, type RefObject } from "react";

import { PackagePlus } from "lucide-react";

import { useController, useWatch, type Control } from "react-hook-form";

import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import DataEmpty from "../../messages/DataEmpty";
import InputNumber from "../../inputs/InputNumber";

import { cn } from "../../../utils/cn";
import { formatRupiah } from "../../../helpers/helpers";

import useModalFormulirTambahProdukStockOpname from "./useModalFormulirTambahProdukStockOpname";
import type { CreateStockOpnameDetailType } from "../../../models/stockOpnameDetail.model";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleSetToast: (data: string) => void;
  handleSetAlert: (data: string) => void;
  isOwner: boolean;
};

/**
 * Tipe form yang digunakan oleh useForm.
 */
type FormValues = {
  details: CreateStockOpnameDetailType[];
};

type ProductRowProps = {
  produk: ResponseProdukForChooseType;
  index: number;
  control: Control<FormValues>;
  checked: boolean;
  isOwner: boolean;
  isPending: boolean;
  handleToggleProduct: (produk: ResponseProdukForChooseType) => void;
  handleTogglePenyesuaian: (produkId: number) => void;
};

const ProductRow: FC<ProductRowProps> = ({
  produk,
  index,
  control,
  checked,
  isOwner,
  isPending,
  handleToggleProduct,
}) => {
  /**
   * Ambil controller lengkap.
   *
   * Jangan menggunakan:
   *
   * const { field } = useController(...)
   *
   * karena InputNumber membutuhkan
   * UseControllerReturn, bukan ControllerRenderProps.
   */
  const stokFisikController = useController<
    FormValues,
    `details.${number}.stokFisik`
  >({
    control,
    name: `details.${index}.stokFisik`,
  });

  /**
   * Ambil nilai stok fisik untuk menghitung selisih.
   */
  const stokFisik = useWatch({
    control,
    name: `details.${index}.stokFisik`,
  });

  /**
   * Ambil nilai penyesuaian.
   */

  const stokSistem = Number(produk.stok ?? 0);

  const stokFisikNumber = Number(stokFisik ?? 0);

  const selisih = stokFisikNumber - stokSistem;

  return (
    <tr className="h-18 text-[0.7rem] text-base-content">
      {/* CHECKBOX */}
      <td>
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={checked}
          onChange={() => handleToggleProduct(produk)}
          disabled={isPending}
        />
      </td>

      {/* NO */}
      <td>{index + 1}</td>

      {/* PRODUK */}
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-10 h-10">
              <img src={produk.img} alt="Foto Produk" loading="lazy" />
            </div>
          </div>

          <div className="flex flex-col justify-start items-start">
            <p className="font-medium">{produk.nama}</p>

            <p className="text-base-content/60">{produk.kode ?? "-"}</p>
          </div>
        </div>
      </td>

      {/* HARGA MODAL */}
      {isOwner && (
        <td className="whitespace-nowrap">
          {formatRupiah(produk.hargaModalRataRata)}
        </td>
      )}

      {/* STOK SISTEM */}
      <td className="font-medium">{stokSistem}</td>

      {/* STOK FISIK */}
      <td>
        <div className="w-20">
          <InputNumber
            controller={stokFisikController}
            placeholder="0"
            max={1000000}
            disabled={!checked || isPending}
          />
        </div>
      </td>

      {/* SELISIH */}
      <td>
        <p
          className={cn(
            "font-medium",
            selisih < 0
              ? "text-error"
              : selisih > 0
                ? "text-success"
                : "text-base-content/70",
          )}
        >
          {selisih}
        </p>
      </td>

      {/* PENYESUAIAN */}
      <td></td>
    </tr>
  );
};

const ModalFormulirTambahProdukStockOpname: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleSetToast,
  handleSetAlert,
  isOwner,
}) => {
  const {
    dataProduk,
    isLoadingDataProduk,

    control,
    fields,

    handleToggleProduct,
    handleTogglePenyesuaian,

    isAllChecked,
    handleToggleSelectAll,

    handleSubmit,

    isPendingStockOpnameDetail,
  } = useModalFormulirTambahProdukStockOpname({
    handleCloseModal,
    handleSetToast,
    handleSetAlert,
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
          h-[85vh]
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

        {/* TABLE */}
        <div
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
          <table className="table table-xs lg:table-sm table-zebra">
            <thead>
              <tr className="h-12 bg-base-200 text-[0.7rem]">
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={isAllChecked}
                    onChange={handleToggleSelectAll}
                    disabled={isLoadingDataProduk || isPendingStockOpnameDetail}
                  />
                </th>

                <th>No</th>

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
              ) : dataProduk.length > 0 ? (
                dataProduk.map((produk, index) => {
                  const fieldIndex = fields.findIndex(
                    (field) => field.produkId === produk.id,
                  );

                  const checked = fieldIndex !== -1;

                  /**
                   * Produk belum dipilih.
                   */
                  if (!checked) {
                    return (
                      <tr
                        key={produk.id}
                        className="h-18 text-[0.7rem] text-base-content"
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={false}
                            onChange={() => handleToggleProduct(produk)}
                            disabled={isPendingStockOpnameDetail}
                          />
                        </td>

                        <td>{index + 1}</td>

                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10">
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
                            {formatRupiah(produk.hargaModalRataRata)}
                          </td>
                        )}

                        <td className="font-medium">{produk.stok}</td>

                        <td>
                          <span className="text-base-content/40">
                            Pilih produk
                          </span>
                        </td>

                        <td>
                          <span className="text-base-content/40">0</span>
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            className="
                                checkbox
                                checkbox-sm
                                cursor-not-allowed
                                opacity-50
                              "
                            disabled
                          />
                        </td>
                      </tr>
                    );
                  }

                  /**
                   * Produk sudah dipilih.
                   */
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
                      handleTogglePenyesuaian={handleTogglePenyesuaian}
                    />
                  );
                })
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
