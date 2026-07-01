import { cn } from "../../../utils/cn";
import { SquareUserRound, Store } from "lucide-react";
import useKasir from "./useKasir";
import PilihProduk from "./PilihProduk";
import Pembayaran from "./Pembayaran";
import Struk from "./Struk";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_TRANSACTION } from "../../../types/toast.type";
import type { FC } from "react";

type Props = {
  isUpdateKeranjang?: boolean;
};
const Kasir: FC<Props> = ({ isUpdateKeranjang }) => {
  // call use
  const {
    step,
    handleSteps,
    pengguna,
    isModeKasir,
    setIsModeKasir,
    handleSetToast,
    toast,
  } = useKasir();

  return (
    <div className="w-full p-3 mb-28 md:mb-20 bg-custom-secondary">
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_TRANSACTION[toast.type].message}
          color={TOAST_CONFIG_TRANSACTION[toast.type].color}
        />
      )}

      <div
        className={cn(
          "min-h-[85vh] w-full flex flex-col justify-start items-start",
          isModeKasir &&
            "fixed z-60 top-0 left-0 right-0 bottom-0 bg-custom-secondary",
        )}
      >
        <div
          className={cn(
            "w-full h-full flex flex-col justify-start items-center gap-3",
            isModeKasir && "h-screen",
          )}
        >
          {/* header */}
          {!isUpdateKeranjang && (
            <div className="w-full flex flex-row justify-between items-center py-1">
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
                  <ul className="steps step text-xs text-primary-white">
                    <li
                      data-content={step > 1 ? "✓" : "1"}
                      className={cn(
                        "step after:w-6 after:h-6",
                        step >= 1 && "step-primary",
                      )}
                    >
                      Pilih Produk
                    </li>

                    <li
                      data-content={step > 2 ? "✓" : "2"}
                      className={cn(
                        "step before:h-1 after:w-6 after:h-6",
                        step >= 2 && "step-primary",
                      )}
                    >
                      Pembayaran
                    </li>
                    <li
                      data-content={step === 3 ? "✓" : "3"}
                      className={cn(
                        "step before:h-1 after:w-6 after:h-6",
                        step === 3 && "step-primary",
                      )}
                    >
                      Struk Pembayaran
                    </li>
                  </ul>
                )}
              </div>

              {isModeKasir && (
                <ul className="steps step text-xs text-base-content">
                  <li
                    data-content={step > 1 ? "✓" : "1"}
                    className={cn(
                      "step after:w-6 after:h-6",
                      step >= 1 && "step-primary",
                    )}
                  >
                    Pilih Produk
                  </li>

                  <li
                    data-content={step > 2 ? "✓" : "2"}
                    className={cn(
                      "step before:h-1 after:w-6 after:h-6",
                      step >= 2 && "step-primary",
                    )}
                  >
                    Pembayaran
                  </li>
                  <li
                    data-content={step === 3 ? "✓" : "3"}
                    className={cn(
                      "step before:h-1 after:w-6 after:h-6",
                      step === 3 && "step-primary",
                    )}
                  >
                    Struk Pembayaran
                  </li>
                </ul>
              )}

              <div className="flex flex-1 flex-row justify-end items-start">
                {/* kasir */}
                <div className="h-14 rounded-lg border border-custom-border px-4 flex flex-row justify-start items-center gap-12 bg-custom-surface">
                  <div className="flex flex-row justify-start items-center gap-2">
                    <SquareUserRound className="size-7 text-primary-white" />
                    <div className="flex flex-col justify-start items-start gap-1">
                      <span className="text-[0.625rem] font-semibold text-primary-white/50">
                        Kasir:
                      </span>
                      <span className="text-xs font-semibold text-primary-white">
                        {pengguna?.nama}
                      </span>
                    </div>
                  </div>

                  {/* button mode Kasir */}
                  <button
                    type="button"
                    onClick={() => setIsModeKasir((prev) => !prev)}
                    className="flex flex-row justify-center items-center gap-2 py-2 px-4 border rounded-md shadow-sm border-custom-border hover:bg-custom-secondary hover:border-custom-primary hover:shadow-sm hover:shadow-custom-primary transition-all duration-300 ease-in-out"
                  >
                    <Store className="size-4 text-primary-white" />
                    <span className="text-primary-white text-xs font-medium">
                      {isModeKasir ? "Keluar Mode Kasir" : "Mode Kasir"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* pilih produk */}
          {step === 1 && (
            <PilihProduk
              handleSteps={handleSteps}
              step={step}
              handleToast={handleSetToast}
              isUpdateKeranjangFromRoute={isUpdateKeranjang}
            />
          )}
          {/* pembayaran */}
          {step === 2 && (
            <Pembayaran
              handleSteps={handleSteps}
              handleToast={handleSetToast}
            />
          )}

          {/* pembayaran */}
          {step === 3 && <Struk handleSteps={handleSteps} />}
        </div>
      </div>
    </div>
  );
};

export default Kasir;
