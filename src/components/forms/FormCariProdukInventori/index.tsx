import { type FC, type RefObject } from "react";
import InputSearch from "../../inputs/InputSearch";
import type { InputSearchRef } from "../../../types/ref.type";
import { cn } from "../../../utils/cn";
import type { ResponseStructure } from "../../../types/response.type";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
} from "../../../helpers/helpers";

type Props = {
  inputSearchRef: RefObject<InputSearchRef | null>;
  handleSearch: (value: string) => void;
  handleShowActiveComponentChooseProduk: () => void;
  handleCloseActiveComponentChooseProduk: () => void;
  error?: string;
  activeComponentChooseProduk?: boolean;
  isLoadingProdukForChoose?: boolean;
  dataProdukForChoose?: ResponseStructure<ResponseProdukForChooseType[] | null>;
  isLoadingDataProdukForChoose?: boolean;
  handleSetValueProdukId: (id: number) => void;
  wrapperRef: RefObject<HTMLDivElement | null>;
};
const FormCariProdukInventori: FC<Props> = ({
  inputSearchRef,
  error,
  handleSearch,
  handleCloseActiveComponentChooseProduk,
  activeComponentChooseProduk,
  handleShowActiveComponentChooseProduk,
  dataProdukForChoose,
  isLoadingProdukForChoose,
  wrapperRef,
  handleSetValueProdukId,
}) => {
  return (
    <div
      ref={wrapperRef}
      className="flex-2 flex flex-col justify-start items-start gap-2"
    >
      <div className="w-full flex flex-col justify-start items-start gap-2 relative">
        {/* label */}
        <div className="relative">
          <label className="capitalize text-xs text-base-content">
            Cari Produk
          </label>

          <span className="absolute -top-1 ml-1 text-error">{"*"}</span>
        </div>

        <InputSearch
          ref={inputSearchRef}
          handleSearch={handleSearch}
          placeholder="Cari produk berdasarkan nama atau kode"
          handleOnFocus={() => handleShowActiveComponentChooseProduk()}
          handleClear={() => handleCloseActiveComponentChooseProduk()}
          errorMessage={error}
          customHeight="h-10"
        />

        {/* modal show data produk for choose */}
        <div
          className={cn(
            "absolute bg-base-100 w-full shadow-xl z-10 rounded-2xl md:rounded-xl top-full grid transition-all duration-300 ease-in-out pb-2.5 mt-1",
            activeComponentChooseProduk ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-y-auto scrollbar-thin">
            <div className={cn("w-full flex flex-col h-60  p-2.5 gap-2")}>
              {isLoadingProdukForChoose ? (
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div className="loading loading-xl" />
                </div>
              ) : dataProdukForChoose?.data &&
                dataProdukForChoose?.data?.length > 0 ? (
                dataProdukForChoose?.data?.map((item, _) => (
                  <button
                    type="button"
                    key={item.id}
                    className="w-full flex flex-row justify-between items-center gap-1 hover:bg-custom-primary/50 p-2 transition-all duration-100 ease-in-out border border-base-content/10 rounded-xl"
                    onClick={() => handleSetValueProdukId(item.id)}
                  >
                    <div className="flex-3 flex flex-row col row justify-start items-start gap-4">
                      {/* img */}
                      <div className="w-11 h-11 rounded-xl overflow-hidden">
                        <img
                          src={item.img}
                          alt="foto produk"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* nama */}
                      <div className="flex flex-col justify-start items-start gap-1">
                        <p className="text-xs font-medium text-base-content">
                          {item.nama}
                        </p>
                        <p className="text-[0.625rem] text-base-content/70 font-medium">
                          {item.kode}
                        </p>
                        <p className="text-[0.625rem] gap-1.5 flex flex-row justify-start items-center text-base-content/70">
                          <span>Stok: </span>
                          <span className="font-medium">
                            {formatNumber(item.stok)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-start items-start gap-1">
                      {/* label */}
                      <span className="text-[0.625rem] text-base-content/50">
                        Harga Beli
                      </span>
                      {/* value */}
                      <span className="text-[0.625rem] font-medium text-base-content">
                        {item.hargaBeli > 1000000
                          ? formatRupiahShort(item.hargaBeli)
                          : formatRupiah(item.hargaBeli)}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <p className="text-xs font-medium text-base-content/50">
                    Data produk tidak ditemukan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCariProdukInventori;
