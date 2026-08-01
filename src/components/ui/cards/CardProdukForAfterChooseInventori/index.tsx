import { type FC } from "react";
import type { ResponseProdukForChooseType } from "../../../../models/produk.model";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";
import { Trash2 } from "lucide-react";
import { cn } from "../../../../utils/cn";

type Props = {
  data: ResponseProdukForChooseType;
  handleDeleteValueProdukId: (id: number) => void;
  customWidth?: string;
};
const CardProdukForAfterChooseInventori: FC<Props> = ({
  data,
  handleDeleteValueProdukId,
  customWidth,
}) => {
  return (
    <div
      key={data.id}
      className={cn(
        "flex flex-row justify-start items-center hover:bg-custom-primary/50 p-2 rounded-2xl md:rounded-xl transition-all duration-100 ease-in-out border border-base-content/10",
        customWidth ?? "col-span-1",
      )}
    >
      <div className="w-full flex flex-row justify-start items-center gap-2">
        <div className="flex-2 w-full flex flex-row justify-start items-start gap-4">
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

        {/* harga beli */}
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <span className="text-[0.625rem] text-base-content/50">
            Harga Beli
          </span>
          {/* value */}
          <span className="text-[0.625rem] font-semibold text-base-content">
            {data.hargaBeli >= 1000000
              ? formatRupiahShort(data.hargaBeli)
              : formatRupiah(data.hargaBeli)}
          </span>
        </div>
      </div>

      {/* button trash */}
      <button
        type="button"
        className="p-2 hover-oveerlay rounded-full bg-error text-primary-white"
        onClick={() => handleDeleteValueProdukId(data.id)}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
};

export default CardProdukForAfterChooseInventori;
