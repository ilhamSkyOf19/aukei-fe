import type { FC } from "react";
import {
  CircleDollarSign,
  CirclePercent,
  ReceiptText,
  ShoppingBasket,
  Undo2,
} from "lucide-react";
import LabelCardPelanggan from "../../LabelCardPelanggan";
import type { ITransactionDetailType } from "../../../../models/transactionDetail.model";
import { formatNumber } from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";
import ButtonWithIcon from "../../button/ButtonWithIcon";

type Props = {
  data: Omit<ITransactionDetailType, "createdAt" | "updatedAt">;
  handleAppend?: (params: {
    detailId: number;
    nama: string;
    kode: string;
    img: string;
    hargaJual: number;
    maxQuantity: number;
    quantityWasRetur: number;
  }) => void;
};
const CardProdukTransaksi: FC<Props> = ({
  handleAppend,
  data: { id, diskon, hargaJual, produk, quantity, totalHarga, totalRetur },
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

        {/* aksi */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          <span className="text-base-content font-semibold text-sm">
            {produk.nama}
          </span>
          <span className="text-base-content/70 font-medium text-xs">
            {produk.kode}
          </span>
        </div>
      </div>

      {/* content 2 */}
      <div
        className={cn(
          "w-full flex flex-col md:flex-row justify-start items-start gap-2 py-2",
          handleAppend && "border-b border-base-content/10",
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

        {/* diskon */}
        <LabelCardPelanggan
          label="Diskon"
          icon={{
            icon: CirclePercent,
            bgColor: "bg-rose-100",
            iconColor: "text-rose-400",
          }}
          valuePrice={diskon}
        />

        {/* Qty pesan */}
        <LabelCardPelanggan
          label="Qty. Pesan"
          icon={{
            icon: ShoppingBasket,
            bgColor: "bg-emerald-100",
            iconColor: "text-emerald-400",
          }}
          valueSting={`${formatNumber(quantity)} Pcs`}
        />

        {/* Qty retur */}
        <LabelCardPelanggan
          label="Qty. Retur"
          icon={{
            icon: Undo2,
            bgColor: "bg-rose-100",
            iconColor: "text-rose-400",
          }}
          valueSting={`${formatNumber(totalRetur)} Pcs`}
        />

        {/* Subtotal */}
        <LabelCardPelanggan
          label="Total Harga"
          icon={{
            icon: ReceiptText,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-400",
          }}
          valuePrice={totalHarga}
        />
      </div>

      {/* handleAppend */}
      {handleAppend && (
        <div className="w-full mt-2.5 flex flex-row justify-end  items-end gap-2.5">
          <ButtonWithIcon
            disabled={quantity <= totalRetur}
            label="Retur"
            icon={Undo2}
            bgColor="bg-error"
            textColor="text-primary-white"
            handleBtn={() =>
              handleAppend({
                detailId: id,
                nama: produk.nama,
                kode: produk.kode,
                img: produk.img,
                hargaJual: hargaJual,
                maxQuantity: quantity,
                quantityWasRetur: totalRetur,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default CardProdukTransaksi;
