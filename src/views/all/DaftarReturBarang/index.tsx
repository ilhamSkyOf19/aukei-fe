import useDaftarReturBarang from "./useDaftarReturBarang";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_RETUR_BARANG } from "../../../types/toast.type";

const DaftarReturBarang = () => {
  const { toast, handleBack } = useDaftarReturBarang();
  return (
    <div className="w-full ">
      <div className="w-full flex flex-col justify-start items-start gap-2.5 px-2.5 pt-2.5">
        <ButtonBackText handleClick={() => handleBack()} />

        {/* toast */}
        {toast && (
          <Toast
            toast={toast?.id !== null}
            isAnimationOut={toast?.isAnimationOut || false}
            label={TOAST_CONFIG_RETUR_BARANG[toast.type].message}
            color={TOAST_CONFIG_RETUR_BARANG[toast.type].color}
          />
        )}
      </div>
    </div>
  );
};

export default DaftarReturBarang;
