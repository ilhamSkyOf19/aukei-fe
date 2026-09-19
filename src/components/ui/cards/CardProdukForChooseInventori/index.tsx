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
};
const CardProdukForChooseInventori: FC<Props> = ({
  data,
  handleSetValueProdukId,
  hargaBeli,
  hargaModal,
  disabled,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "w-full flex flex-row justify-between items-center gap-1  p-2 transition-all duration-100 ease-in-out border border-base-content/10 rounded-xl relative",
        !disabled && "hover:bg-custom-primary/50",
      )}
      onClick={() => handleSetValueProdukId(data.id)}
    >
      {disabled && (
        <span className="text-[0.625rem] text-base-content italic absolute left-1/2 bottom-2 -translate-x-1/2">
          Sudah dipilih
        </span>
      )}

      <div className="flex-4 flex flex-row col row justify-start items-start gap-4">
        {/* img */}
        <div className="w-11 h-11 shrink-0 rounded-xl overflow-hidden">
          <img
            src={data.img}
            alt="foto produk"
            className="w-full h-full object-cover"
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
    </button>
  );
};

export default CardProdukForChooseInventori;
