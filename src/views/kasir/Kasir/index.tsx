import { useState, type FC } from "react";
import { cn } from "../../../utils/cn";
import { Store } from "lucide-react";
import { highlightName } from "../../../helpers/helpers";
import useKasir from "./useKasir";
import PilihProduk from "./PilihProduk";

const Kasir = () => {
  // state mode kasir
  const [isModeKasir, setIsModeKasir] = useState<boolean>(false);

  // call use
  const {
    errors,
    fieldsDetails,
    handleAppend,
    metodePembayaranController,
    removeDetails,
    produkDetails,
    control,
    handleStepsNext,
    step,
  } = useKasir();

  return (
    <div className="w-full p-2 mb-28 md:mb-20">
      <div
        className={cn(
          "card dark:border dark:border-base-content/10 w-full bg-base-100 flex flex-col justify-start items-start",
          isModeKasir
            ? "fixed z-60 top-0 left-0 right-0 bottom-0"
            : "shadow-sm",
        )}
      >
        <div
          className={cn(
            "w-full h-full flex flex-col justify-start items-center",
            isModeKasir && "h-screen",
          )}
        >
          {/* header */}
          <div className="w-full flex flex-row justify-between items-center py-4 px-4 pb-4 border-b border-base-content/10">
            {/* title */}
            <div className="flex flex-1 justify-start items-center gap-3">
              {isModeKasir ? (
                <>
                  {/* icon */}
                  <Store className="size-6 tetx-custom-primary" />
                  <h2 className="text-base-content font-semibold text-lg">
                    Kasir
                  </h2>
                </>
              ) : (
                <ul className="steps step text-xs">
                  <li className={cn("step", step >= 1 && "step-success")}>
                    Pilih Produk
                  </li>
                  <li className={cn("step", step >= 2 && "step-success")}>
                    Pembayaran
                  </li>
                  <li className={cn("step", step === 3 && "step-success")}>
                    Struk Pembayaran
                  </li>
                </ul>
              )}
            </div>

            <div className="flex flex-1 flex-row justify-end items-center">
              {/* button mode Kasir */}
              <button
                type="button"
                onClick={() => setIsModeKasir((prev) => !prev)}
                className="flex flex-row justify-center items-center gap-2 py-2 px-4 border rounded-md shadow-sm border-base-content/10 hover:shadow-custom-primary hover:border-custom-primary hover:bg-custom-primary hover:text-primary-white transition-all duration-300 ease-in-out"
              >
                <Store className="size-4 text-base-content" />
                <span className="text-base-content text-xs font-medium">
                  {isModeKasir ? "Keluar Mode Kasir" : "Mode Kasir"}
                </span>
              </button>
            </div>
          </div>

          {/* pilih produk */}
          {step === 1 && (
            <PilihProduk
              handleStepsNext={handleStepsNext}
              control={control}
              fieldsDetails={fieldsDetails}
              handleAppend={handleAppend}
              produkDetails={produkDetails}
              removeDetails={removeDetails}
            />
          )}
          {/* pembayaran */}
          {step === 2 && <div></div>}
        </div>
      </div>
    </div>
  );
};

export default Kasir;
