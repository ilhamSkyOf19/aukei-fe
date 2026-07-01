import DataPelanggan from "./DataPelanggan";
import useKeranjang from "./useKeranjang";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_KERANJANG } from "../../../types/toast.type";
import DaftarKeranjang from "./DaftarKeranjang";

const Keranjang = () => {
  // use call
  const { toast } = useKeranjang();

  return (
    <div className="w-full flex flex-row justify-between items-start p-4 gap-4 ">
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_KERANJANG[toast.type].message}
          color={TOAST_CONFIG_KERANJANG[toast.type].color}
        />
      )}

      {/* left */}
      <div className="flex-3 flex flex-col justify-start items-start gap-4">
        {/* daftar pelanggan */}
        <DataPelanggan />
      </div>

      <DaftarKeranjang />
    </div>
  );
};

export default Keranjang;
