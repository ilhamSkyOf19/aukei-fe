import type { FC } from "react";
import type { ResponseProdukForKasirType } from "../../../models/produk.model";
import { formatNumber, formatRupiah } from "../../../helpers/helpers";
import ButtonText from "../../ui/button/ButtonText";

type Props = {
  item: ResponseProdukForKasirType;
  terpilih: boolean;
  handleGantiProduk: () => void;
};
const CardSimpleProduk: FC<Props> = ({ item, terpilih, handleGantiProduk }) => {
  return (
    <div className=" shrink-0 flex rounded-xl flex-row justify-between items-center gap-2.5 p-2.5 bg-primary-white shadow-sm w-full">
      <div className="flex flex-row justify-start items-start gap-2">
        <div className="w-12 h-12 rounded-xl overflow-hidden">
          <img
            src={item.img}
            alt="foto produk"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-start items-start">
          <span className="text-xs font-medium text-base-content ">
            {item.nama}
          </span>
          <span className="text-[0.625rem] text-base-content ">
            {item.kategori.nama}
          </span>

          <div className="flex flex-row justify-start items-center gap-8 mt-2">
            <span className="text-[0.625rem] font-medium text-base-content ">
              {formatRupiah(item.hargaJual)}
            </span>
            <span className="text-[0.625rem] font-medium text-base-content ">
              Stok : {formatNumber(item.stok)}
            </span>
          </div>
        </div>
      </div>

      <ButtonText
        disable={terpilih}
        label={terpilih ? "Terpilih" : "Pilih"}
        handleClick={() => handleGantiProduk()}
      />
    </div>
  );
};

export default CardSimpleProduk;
