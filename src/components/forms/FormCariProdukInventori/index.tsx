import { type FC, type RefObject } from "react";
import InputSearch from "../../inputs/InputSearch";
import type { InputSearchRef } from "../../../types/ref.type";
import { cn } from "../../../utils/cn";
import type { ResponseStructure } from "../../../types/response.type";
import type { ResponseProdukForChooseType } from "../../../models/produk.model";
import CardProdukForChooseInventori from "../../ui/cards/CardProdukForChooseInventori";

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
            "absolute bg-base-100 w-full shadow-xl z-10 rounded-2xl md:rounded-xl top-full grid transition-all duration-300 ease-in-out mt-1",
            activeComponentChooseProduk
              ? "grid-rows-[1fr] pb-2.5"
              : "grid-rows-[0fr]",
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
                  <CardProdukForChooseInventori
                    key={item.id}
                    data={item}
                    handleSetValueProdukId={handleSetValueProdukId}
                  />
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
