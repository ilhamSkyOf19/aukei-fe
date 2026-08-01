import { type FC } from "react";
import JenisNotifikasiProduk from "../../JenisNotifikasiProduk";
import type { INotifikasiProdukType } from "../../../../models/notifikasiProduk.model";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import { ROLE_INTERNAL_TYPE } from "../../../../types/constant.type";
import { formatNumber } from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";
import ButtonWithIcon from "../../button/ButtonWithIcon";
import { Eye } from "lucide-react";

type Props = {
  pengguna?: PayloadPenggunaInternalType | null;
  data: INotifikasiProdukType;
  handleRedirectProdukDetail?: (id: number) => void;
  large?: boolean;
};

const CardNotifikasiProduk: FC<Props> = ({
  handleRedirectProdukDetail,
  pengguna,
  data: { id, jenisNotifikasiProduk, produk },
  large,
}) => {
  return large ? (
    <div
      key={id}
      className={cn(
        "w-full border border-base-content/10 rounded-2xl md:rounded-xl flex flex-row justify-between items-center p-0 duration-150 ease-in-out bg-base-100 hover:bg-custom-primary/30 hover:border-custom-secondary shadow-xs",
      )}
    >
      <div className="w-full h-full p-2.5 flex flex-row justify-between items-center">
        <div className="flex-6 flex flex-row justify-start items-start gap-3">
          {/* img */}
          <div className="w-11 h-11 rounded-2xl md:rounded-xl overflow-hidden">
            <img
              src={produk.img}
              alt="foto produk"
              className="w-full h-full object-cover"
            />
          </div>

          {/* info */}
          <div className="flex flex-col justify-start items-start gap-0.5">
            <span className="font-semibold text-xs text-base-content">
              {produk.nama}
            </span>
            <div className="flex flex-row justify-start items-center gap-4">
              <div className="flex flex-col justify-start items-start pr-4 border-r border-base-content/30">
                <span className="text-[0.625rem] text-base-content/70">
                  Kode
                </span>
                <span className="text-[0.625rem] text-base-content font-medium">
                  {produk.kode}
                </span>
              </div>
              <div className="flex flex-col justify-start items-start pr-4 border-r border-base-content/30">
                <span className="text-[0.625rem] text-base-content/70">
                  Kategori
                </span>
                <span className="text-[0.625rem] font-medium pr-4">
                  {produk.kategori.nama}
                </span>
              </div>
              <div className="flex flex-col justify-start items-start pr-4 border-r border-base-content/30">
                <span className="text-[0.625rem] text-base-content/70">
                  Stok
                </span>
                <span className="text-[0.625rem] font-medium text-base-content">
                  {formatNumber(produk.stok)}
                </span>
              </div>
              <div className="flex flex-col justify-start items-start pr-4">
                <span className="text-[0.625rem] text-base-content/70">
                  Status
                </span>
                <span className="text-[0.625rem] font-medium text-base-content">
                  <JenisNotifikasiProduk
                    jenisNotifikasi={jenisNotifikasiProduk}
                    xs
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* status */}
        {handleRedirectProdukDetail && (
          <div className="flex-1 flex flex-row justify-end items-center">
            <ButtonWithIcon
              icon={Eye}
              label="Lihat Detail"
              handleBtn={() => handleRedirectProdukDetail(produk.id)}
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div
      key={id}
      className={cn(
        "w-full border border-base-content/10 rounded-2xl md:rounded-xl flex flex-row justify-between items-center p-0 duration-150 ease-in-out bg-base-100 hover:bg-base-300",
      )}
    >
      <button
        disabled={pengguna?.role === ROLE_INTERNAL_TYPE.KASIR}
        type="button"
        className="w-full h-full p-2.5 flex flex-row justify-between items-center"
        onClick={() => {
          if (!handleRedirectProdukDetail) return;
          handleRedirectProdukDetail(produk.id);
        }}
      >
        <div className="flex-2 flex flex-row justify-start items-start gap-3">
          {/* img */}
          <div className="w-11 h-11 rounded-2xl md:rounded-xl overflow-hidden">
            <img
              src={produk.img}
              alt="foto produk"
              className="w-full h-full object-cover"
            />
          </div>

          {/* info */}
          <div className="flex flex-col justify-start items-start gap-0.5">
            <span className="font-semibold text-xs text-base-content">
              {produk.nama}
            </span>
            <span className="text-[0.625rem] font-medium text-base-content">
              {produk.kode}
            </span>
            <div className="flex flex-row justify-start items-center gap-2.5">
              <span className="text-[0.625rem] text-base-content/70 pr-4 border-r border-base-content/30">
                {produk.kategori.nama}
              </span>
              <span className="text-[0.625rem] text-base-content/70">
                Stok: {formatNumber(produk.stok)}
              </span>
            </div>
          </div>
        </div>

        {/* status */}
        <div className="flex-1 flex flex-row justify-end items-center">
          <JenisNotifikasiProduk jenisNotifikasi={jenisNotifikasiProduk} />
        </div>
      </button>
    </div>
  );
};

export default CardNotifikasiProduk;
