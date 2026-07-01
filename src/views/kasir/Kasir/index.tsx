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
    <div className="w-full p-3 mb-28 md:mb-20">
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
          "min-h-[85vh] w-full flex flex-col justify-start items-start transition-all duration-500 ease-in-out",
          isModeKasir &&
            "fixed z-60 top-0 left-0 right-0 bottom-0 bg-base-300 p-2",
        )}
      >
        <div
          className={cn(
            "w-full h-full flex flex-col justify-start items-center gap-2.5",
            isModeKasir && "h-screen",
          )}
        >
          {/* header */}
          {!isUpdateKeranjang && (
            <div
              className={cn(
                "w-full flex flex-row justify-between items-center py-1 rounded-lg border border-transparent dark:border-base-content/10 shadow-sm",
                isModeKasir ? "bg-custom-secondary " : "bg-base-100",
              )}
            >
              {/* title */}
              <div className="flex flex-1 justify-start items-center gap-3">
                <div className={cn("h-full px-4")}>
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <Store
                        className={cn(
                          "size-6",
                          isModeKasir
                            ? "text-primary-white"
                            : "text-base-content",
                        )}
                      />
                      <h2
                        className={cn(
                          " font-semibold text-lg",
                          isModeKasir
                            ? "text-primary-white"
                            : "text-base-content",
                        )}
                      >
                        Kasir
                      </h2>
                    </div>

                    {/* line */}
                    <div
                      className={cn(
                        "h-8 w-px ",
                        isModeKasir
                          ? "bg-primary-white/50"
                          : "bg-base-content/50",
                      )}
                    />

                    {/* aukei */}
                    <p
                      className={cn(
                        "text-lg font-bold ",
                        isModeKasir
                          ? "text-primary-white"
                          : "text-custom-secondary",
                      )}
                    >
                      AU<span className="text-custom-primary">KEI</span>
                    </p>
                  </div>
                </div>
              </div>

              <ul
                className={cn(
                  "steps step text-xs",
                  isModeKasir ? "text-primary-white" : "text-base-content",
                )}
              >
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

              <div className="flex flex-1 flex-row justify-end items-start">
                {/* kasir */}
                <div
                  className={cn(
                    "h-14 rounded-lg flex flex-row justify-start items-center gap-12 px-4",
                  )}
                >
                  <div className="flex flex-row justify-start items-center gap-2">
                    <SquareUserRound
                      className={cn(
                        "size-7",
                        isModeKasir
                          ? "text-primary-white"
                          : "text-base-content",
                      )}
                    />
                    <div className="flex flex-col justify-start items-start gap-1">
                      <span
                        className={cn(
                          "text-[0.625rem] font-semibold",
                          isModeKasir
                            ? "text-primary-white"
                            : "text-base-content/50",
                        )}
                      >
                        Kasir:
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isModeKasir
                            ? "text-primary-white"
                            : "text-base-content",
                        )}
                      >
                        {pengguna?.nama}
                      </span>
                    </div>
                  </div>

                  {/* button mode Kasir */}
                  <button
                    type="button"
                    onClick={() => setIsModeKasir((prev) => !prev)}
                    className={cn(
                      "flex flex-row justify-center items-center gap-2 py-2 px-4 border rounded-md shadow-sm  hover:border-custom-primary hover:shadow-sm hover:shadow-custom-primary transition-all duration-300 ease-in-out hover:scale-102 origin-center",
                      isModeKasir
                        ? "border-primary-white text-primary-white"
                        : "border-base-content tetx-base-content",
                    )}
                  >
                    <Store className="size-4" />
                    <span className="text-xs font-medium">
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
