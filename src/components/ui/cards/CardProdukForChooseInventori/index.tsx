import { type FC } from "react";
import type { ResponseProdukForChooseType } from "../../../../models/produk.model";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";

type Props = {
  handleSetValueProdukId: (id: number) => void;
  data: ResponseProdukForChooseType;
  hargaBeli?: boolean;
  hargaModal?: boolean;
};
const CardProdukForChooseInventori: FC<Props> = ({
  data,
  handleSetValueProdukId,
  hargaBeli,
  hargaModal,
}) => {
  return (
    <button
      type="button"
      className="w-full flex flex-row justify-between items-center gap-1 hover:bg-custom-primary/50 p-2 transition-all duration-100 ease-in-out border border-base-content/10 rounded-xl"
      onClick={() => handleSetValueProdukId(data.id)}
    >
      <div className="flex-4 flex flex-row col row justify-start items-start gap-4">
        {/* img */}
        <div className="w-11 h-11 rounded-xl overflow-hidden">
          <img
            src={data.img}
            alt="foto produk"
            className="w-full h-full object-cover"
          />
        </div>

        {/* nama */}
        <div className="flex flex-col justify-start items-start gap-1">
          <p className="text-xs font-medium text-base-content">{data.nama}</p>
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
          {hargaModal ? "Harga Modal" : "Hrg. Beli Terakhir"}
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
