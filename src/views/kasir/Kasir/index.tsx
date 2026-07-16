import { cn } from "../../../utils/cn";
import useKasir from "./useKasir";
import PilihProduk from "./PilihProduk";
import Pembayaran from "./Pembayaran";
import Struk from "./Struk";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_TRANSACTION } from "../../../types/toast.type";
import type { FC } from "react";
import HeaderKasir from "../../../components/ui/HeaderKasir";
import NotCompatible from "../../../components/messages/NotCompatible";

type Props = {
  isUpdateKeranjang?: boolean;
};
const Kasir: FC<Props> = ({ isUpdateKeranjang }) => {
  // call use
  const { step, handleSteps, isModeKasir, handleSetToast, toast } = useKasir();

  return (
    <div className="w-full p-3 lg:h-[91vh] overflow-y-auto">
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
          "min-h-[85vh] w-full lg:flex flex-col justify-start items-start hidden",
          isModeKasir && "fixed z-40 top-0 left-0 right-0 bottom-0 bg-base-300",
        )}
      >
        <div
          className={cn(
            "w-full h-full flex flex-col justify-start items-center gap-2.5",
            isModeKasir && "h-screen",
            step === 3 && "overflow-y-auto",
          )}
        >
          {/* header */}
          {(!isUpdateKeranjang || isModeKasir) && (
            <HeaderKasir {...(!isUpdateKeranjang && { step: step })} />
          )}

          <div
            className={cn(
              "w-full flex flex-col justify-start items-center",
              isModeKasir && "p-2",
            )}
          >
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

      {/* message  */}
      <NotCompatible />
    </div>
  );
};

export default Kasir;
