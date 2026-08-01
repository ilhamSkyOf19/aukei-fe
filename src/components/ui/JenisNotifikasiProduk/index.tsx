import type { FC } from "react";
import {
  JENIS_NOTIFIKASI_PRODUK_TYPE,
  type JenisNotifikasiProdukType,
} from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  jenisNotifikasi: JenisNotifikasiProdukType;
  xs?: boolean;
};
const JenisNotifikasiProduk: FC<Props> = ({ jenisNotifikasi, xs }) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <p
        className={cn(
          "  font-medium  border",
          xs
            ? "text-[0.525rem] px-1.5 py-0.5 rounded-sm"
            : "rounded-md text-[0.625rem] px-2 py-1",
          jenisNotifikasi === JENIS_NOTIFIKASI_PRODUK_TYPE.STOK_MINUS ||
            jenisNotifikasi === JENIS_NOTIFIKASI_PRODUK_TYPE.STOK_EMPTY
            ? "text-error border-error"
            : jenisNotifikasi === JENIS_NOTIFIKASI_PRODUK_TYPE.STOK_MINIMUM &&
                "text-amber-500 border-amber-400",
        )}
      >
        {(jenisNotifikasi === JENIS_NOTIFIKASI_PRODUK_TYPE.STOK_MINUS &&
          "Stok Minus") ||
          (jenisNotifikasi === JENIS_NOTIFIKASI_PRODUK_TYPE.STOK_EMPTY &&
            "Stok Kosong") ||
          (jenisNotifikasi === JENIS_NOTIFIKASI_PRODUK_TYPE.STOK_MINIMUM &&
            "Stok Sedikit")}
      </p>
    </div>
  );
};

export default JenisNotifikasiProduk;
