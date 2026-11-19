import { type FC } from "react";
import type { ResponseProdukForChooseType } from "../../../../models/produk.model";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";

type Props = {
  handleSetValueProdukId: (id: number) => void;
  data: ResponseProdukForChooseType;
  hargaBeli?: boolean;
  hargaModal?: boolean;
  disabled?: boolean;
  stockNotEnoughDisabled?: boolean;
};
const CardProdukForChooseInventori: FC<Props> = ({
  data,
  handleSetValueProdukId,
  hargaBeli,
  hargaModal,
  disabled,
  stockNotEnoughDisabled,
}) => {
  return (
    <button
      type="button"
      disabled={disabled || stockNotEnoughDisabled}
      className={cn(
        "w-full flex flex-row justify-between items-center gap-1  p-2 transition-all duration-100 ease-in-out border border-base-content/10 rounded-xl relative opacity-100!",
        !disabled &&
          !stockNotEnoughDisabled &&
          "hover:bg-custom-primary/50 relative",
      )}
      onClick={() => handleSetValueProdukId(data.id)}
    >
      {(disabled || stockNotEnoughDisabled) && (
        <span
          className={cn(
            "z-10 -top-1.5 right-0 text-[0.625rem] text-primary-white italic absolute px-2.5 rounded-full",
            stockNotEnoughDisabled ? "bg-rose-600" : "bg-emerald-600",
          )}
        >
          {stockNotEnoughDisabled ? "stok kurang" : "sudah dipilih"}
        </span>
      )}
      <div
        className={cn(
          "w-full flex flex-row justify-start items-center",
          (disabled || stockNotEnoughDisabled) && "opacity-50",
        )}
      >
        <div className="flex-4 flex flex-row col row justify-start items-start gap-4">
          {/* img */}
          <div className="w-11 h-11 shrink-0 rounded-xl overflow-hidden">
            <img
              src={data.img}
              alt="foto produk"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* nama */}
          <div className="flex flex-col justify-start items-start gap-0.5">
            <div className="flex flex-col justify-start items-start">
              <p className="text-xs font-medium text-base-content text-left">
                {data.nama}
              </p>
              <p className="text-[0.625rem] font-medium text-base-content/70">
                {data.kategori}
              </p>
            </div>
            <p className="text-[0.625rem] text-base-content/70 font-medium">
              {data.kode}
            </p>
            <p className="text-[0.625rem] gap-1.5 flex flex-row justify-start items-center text-base-content/70">
              <span>Stok: </span>
              <span className="font-medium">{formatNumber(data.stok)}</span>
            </p>
          </div>
        </div>

        <div className="flex-2 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <span className="text-[0.625rem] text-base-content/50">
            {hargaModal ? "Harga Modal" : hargaBeli && "Hrg. Beli Terakhir"}
          </span>
          {/* value */}
          {hargaBeli && (
            <span className="text-[0.625rem] font-medium text-base-content">
              {data.hargaBeli > 1000000
                ? formatRupiahShort(data.hargaBeli)
                : formatRupiah(data.hargaBeli)}
            </span>
          )}

          {hargaModal && (
            <span className="text-[0.625rem] font-medium text-base-content">
              {data.hargaModalRataRata > 1000000
                ? formatRupiahShort(data.hargaModalRataRata)
                : formatRupiah(data.hargaModalRataRata)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default CardProdukForChooseInventori;
