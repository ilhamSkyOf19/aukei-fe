import DataPelanggan from "./DataPelanggan";
import useKeranjang from "./useKeranjang";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_KERANJANG } from "../../../types/toast.type";
import DaftarKeranjang from "./DaftarKeranjang";
import { cn } from "../../../utils/cn";
import HeaderKasir from "../../../components/ui/HeaderKasir";
import NotCompatible from "../../../components/messages/NotCompatible";

const Keranjang = () => {
  // use call
  const { toast, isModeKasir } = useKeranjang();

  return (
    <div
      className={cn(
        "w-full flex flex-col h-screen justify-start items-start gap-2 p-2.5",
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

      <div className="w-full h-full flex-row justify-between items-start gap-2 lg:flex hidden">
        {/* left */}
        <div className="flex-2 h-full flex flex-col justify-start items-start">
          {/* daftar pelanggan */}
          <DataPelanggan />
        </div>

        <DaftarKeranjang />
      </div>

      {/* message */}
      <NotCompatible />
    </div>
  );
};

export default Keranjang;
