import type { FC } from "react";
import {
  CircleDollarSign,
  Package,
  PackageCheck,
  PackageX,
} from "lucide-react";
import LabelCardPelanggan from "../../LabelCardPelanggan";
import { cn } from "../../../../utils/cn";
import type { IProduk } from "../../../../models/produk.model";

type Props = {
  // final retur
  data: {
    id: number;
    transactionDetailId?: number | undefined;
    quantityReturn?: number | undefined;
    quantityGood?: number | undefined;
    quantityDamaged?: number | undefined;
    totalRefund?: number | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    hargaJual: number;
    produk: Pick<IProduk, "id" | "img" | "nama" | "kode">;
    totalRetur: number;
    diskon: number;
    quantity: number;
    subtotal: number;
    totalHarga: number;
  };
};
const CardProdukRetur: FC<Props> = ({
  data: {
    quantityDamaged,
    quantityGood,
    quantityReturn,
    totalRefund,
    hargaJual,
    produk,
    totalRetur,
    quantity,
  },
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 p-4 shrink-0 snap-center snap-always">
      {/* content 1 */}
      <div className="w-full flex flex-row gap-4 justify-start items-center pb-4 borde border-b border-base-content/10">
        <div className="flex justify-start items-start gap-4">
          {/* foto */}
          <div className="w-12 h-12 overflow-hidden rounded-2xl">
            <img src={produk.img} alt="foto produk" loading="lazy" />
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-0.5">
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-base-content font-semibold text-sm">
              {produk.nama}
            </span>

            <div className="flex flex-row justify-center items-center">
              {quantity <= (quantityReturn ?? 0) + totalRetur ? (
                <span className="px-2.5 py-2 bg-rose-100 text-rose-600 text-xs text-medium rounded-full">
                  Tidak Cukup
                </span>
              ) : (
                <span className="px-2.5 py-2 bg-emerald-100 text-emerald-600 text-xs text-medium rounded-full">
                  Cukup
                </span>
              )}
            </div>
          </div>
          <span className="text-base-content/70 font-medium text-xs">
            {produk.kode}
          </span>
        </div>
      </div>

      {/* content 2 */}
      <div
        className={cn(
          "w-full flex flex-col md:flex-row justify-start items-start gap-2 py-2",
        )}
      >
        {/* harga jual */}
        <LabelCardPelanggan
          label="Harga Jual"
          icon={{
            icon: CircleDollarSign,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-400",
          }}
          valuePrice={hargaJual}
        />

        {/* Qty good */}
        <LabelCardPelanggan
          label="Qty. Barang Bagus"
          icon={{
            icon: PackageCheck,
            bgColor: "bg-emerald-100",
            iconColor: "text-emerald-400",
          }}
          value={quantityGood}
        />

        {/* Qty damaged */}
        <LabelCardPelanggan
          label="Qty. Barang Rusak"
          icon={{
            icon: PackageX,
            bgColor: "bg-rose-100",
            iconColor: "text-rose-400",
          }}
          value={quantityDamaged}
        />

        {/* Qty total */}
        <LabelCardPelanggan
          label="Qty. Total"
          icon={{
            icon: Package,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-400",
          }}
          value={quantityReturn}
        />

        {/* total refund */}
        <LabelCardPelanggan
          label="Total Refund"
          icon={{
            icon: CircleDollarSign,
            bgColor: "bg-amber-100",
            iconColor: "text-amber-400",
          }}
          valuePrice={totalRefund}
        />
      </div>
    </div>
  );
};

export default CardProdukRetur;
