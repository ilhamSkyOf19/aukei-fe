import { cn } from "../../../utils/cn";
import useKasir from "./useKasir";
import PilihProduk from "./PilihProduk";
import Pembayaran from "./Pembayaran";
import Struk from "./Struk";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_TRANSACTION } from "../../../types/toast.type";
import NotCompatible from "../../../components/messages/NotCompatible";
import Booking from "./Booking";

const Kasir = () => {
  // call use
  const { step, handleSetToast, toast, kasir } = useKasir();

  return (
    <div className={cn("w-full h-full pt-2.5 px-2.5")}>
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_TRANSACTION[toast.type].message}
          color={TOAST_CONFIG_TRANSACTION[toast.type].color}
        />
      )}

      <div
        className={cn("w-full h-full flex flex-col justify-start items-center")}
      >
        {/* pilih produk */}
        {step === 1 && <PilihProduk handleToast={handleSetToast} />}
        {/* pembayaran */}
        {step === 2 && (
          <Pembayaran handleToast={handleSetToast} kasir={kasir} />
        )}

        {/* struk */}
        {step === 3 && <Struk />}

        {/* booking */}
        {step === 4 && <Booking handleToast={handleSetToast} kasir={kasir} />}
      </div>
      {/* message  */}
      <NotCompatible />
    </div>
  );
};

export default Kasir;
