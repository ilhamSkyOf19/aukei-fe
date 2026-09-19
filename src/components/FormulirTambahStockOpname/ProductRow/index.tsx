import { type FC } from "react";
import { useController, useWatch, type Control } from "react-hook-form";

import InputNumber from "../../inputs/InputNumber";
import InputChoose from "../../inputs/InputChoose";

import { cn } from "../../../utils/cn";
import { formatNumber, formatRupiah } from "../../../helpers/helpers";

import { JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE } from "../../../types/constant.type";

import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import type { CreateStockOpnameDetailArrayType } from "../../../models/stockOpnameDetail.model";

type FormValues = {
  details: CreateStockOpnameDetailArrayType["details"];
};

type ProductRowProps = {
  produk: ResponseProdukForChooseType;

  index: number;

  control: Control<FormValues>;

  checked: boolean;

  isOwner: boolean;

  isPending: boolean;

  handleToggleProduct: (produk: ResponseProdukForChooseType) => void;

  error?: string;
};

const ProductRow: FC<ProductRowProps> = ({
  produk,
  index,
  control,
  checked,
  isOwner,
  isPending,
  handleToggleProduct,
  error,
}) => {
  // =========================================================
  // STOK FISIK
  // =========================================================

  const stokFisikController = useController<
    FormValues,
    `details.${number}.stokFisik`
  >({
    control,
    name: `details.${index}.stokFisik`,
  });

  // =========================================================
  // JENIS PENYESUAIAN
  // =========================================================

  const jenisPenyesuaianController = useController<
    FormValues,
    `details.${number}.jenisPenyesuaian`
  >({
    control,
    name: `details.${index}.jenisPenyesuaian`,
  });

  // =========================================================
  // WATCH STOK FISIK
  // =========================================================

  const stokFisik = useWatch({
    control,
    name: `details.${index}.stokFisik`,
  });

  // =========================================================
  // STOK SISTEM
  // =========================================================

  const stokSistem = Number(produk.stok ?? 0);

  // =========================================================
  // STOK FISIK
  // =========================================================

  const stokFisikNumber = Number(stokFisik ?? 0);

  // =========================================================
  // SELISIH
  // =========================================================

  const selisih = stokFisikNumber - stokSistem;

  return (
    <tr className="h-12 text-[0.7rem] text-base-content">
      {/* =================================================== */}
      {/* CHECKBOX */}
      {/* =================================================== */}

      <td>
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={checked}
          onChange={() => handleToggleProduct(produk)}
          disabled={isPending}
        />
      </td>

      {/* =================================================== */}
      {/* NO */}
      {/* =================================================== */}

      <td className="hidden lg:block">{index + 1}</td>

      {/* =================================================== */}
      {/* PRODUK */}
      {/* =================================================== */}

      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-8 h-8">
              <img src={produk.img} alt="Foto Produk" loading="lazy" />
            </div>
          </div>

          <div className="flex flex-col justify-start items-start">
            <p className="font-medium">{produk.nama}</p>

            <p className="text-base-content/60">{produk.kode ?? "-"}</p>
          </div>
        </div>

        {/* Error produk */}
        {error && <p className="text-error text-[0.625rem] mt-2.5">{error}</p>}
      </td>

      {/* =================================================== */}
      {/* HARGA MODAL */}
      {/* =================================================== */}

      {isOwner && (
        <td className="whitespace-nowrap">
          {formatRupiah(produk.hargaModalRataRata ?? 0)}
        </td>
      )}

      {/* =================================================== */}
      {/* STOK SISTEM */}
      {/* =================================================== */}

      <td className="font-medium">{stokSistem}</td>

      {/* =================================================== */}
      {/* STOK FISIK */}
      {/* =================================================== */}

      <td>
        <div className="w-20">
          <InputNumber<FormValues>
            controller={stokFisikController}
            placeholder="0"
            max={1000000}
            disabled={!checked || isPending}
            customHeight="h-9 md:h-9"
          />
        </div>
      </td>

      {/* =================================================== */}
      {/* SELISIH */}
      {/* =================================================== */}

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
          {`${selisih > 0 ? "+" : ""}${formatNumber(selisih)}`}
        </p>
      </td>

      {/* =================================================== */}
      {/* PENYESUAIAN */}
      {/* =================================================== */}

      <td>
        {selisih >= 0 ? (
          <span>-</span>
        ) : (
          <div className="w-45">
            <InputChoose<FormValues>
              required={false}
              placeholder="Jenis Penyesuaian"
              controller={jenisPenyesuaianController}
              chooseList={[
                {
                  label: "Masuk Kerugian",
                  value: JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE.MASUK_KERUGIAN,
                },
                {
                  label: "Tidak Masuk Kerugian",
                  value:
                    JENIS_PENYESUAIAN_STOCK_OPNAME_TYPE.TIDAK_MASUK_KERUGIAN,
                },
              ]}
            />
          </div>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;
