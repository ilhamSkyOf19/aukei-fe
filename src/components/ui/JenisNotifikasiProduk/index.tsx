import type { FC } from "react";
import {
  JENIS_NOTIFIKASI_PRODUK_TYPE,
  type JenisNotifikasiProdukType,
} from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  jenisNotifikasi: JenisNotifikasiProdukType;
};
const JenisNotifikasiProduk: FC<Props> = ({ jenisNotifikasi }) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <p
        className={cn(
          "text-[0.625rem] rounded-md font-medium px-2 py-1 border",
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
