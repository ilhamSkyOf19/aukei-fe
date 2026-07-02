import DataPelanggan from "./DataPelanggan";
import useKeranjang from "./useKeranjang";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_KERANJANG } from "../../../types/toast.type";
import DaftarKeranjang from "./DaftarKeranjang";
import { cn } from "../../../utils/cn";
import HeaderKasir from "../../../components/ui/HeaderKasir";

const Keranjang = () => {
  // use call
  const { toast, isModeKasir } = useKeranjang();

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start gap-4",
        isModeKasir
          ? "fixed z-40 top-0 left-0 right-0 bottom-0 bg-base-300"
          : "p-4",
      )}
    >
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_KERANJANG[toast.type].message}
          color={TOAST_CONFIG_KERANJANG[toast.type].color}
        />
      )}

      {isModeKasir && <HeaderKasir />}

      <div className="w-full flex flex-row justify-between items-start gap-4 p-2">
        {/* left */}
        <div className="flex-3 flex flex-col justify-start items-start gap-4">
          {/* daftar pelanggan */}
          <DataPelanggan />
        </div>

        <DaftarKeranjang />
      </div>
    </div>
  );
};

export default Keranjang;
