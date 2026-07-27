import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import KategoriCluster from "./KategoriCluster";
import useProduk from "./useProduk";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_PRODUK } from "../../../types/toast.type";
import DaftarProduk from "./DaftarProduk";
import Alert from "../../../components/messages/Alert";
import { ALERT_CONFIG_PRODUK } from "../../../types/alert.types";

const Produk = () => {
  // call use
  const {
    handleActiveCluster,
    isActiveCluster,
    handleSetToast,
    toast,
    alert,
    handleSetAlert,
  } = useProduk();

  return (
    <div className="w-full">
      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_PRODUK[toast.type].message}
          color={TOAST_CONFIG_PRODUK[toast.type].color}
        />
      )}

      {/* alert */}
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_PRODUK[alert.type].message}
        />
      )}

      <div className="w-full mb-2.5 flex flex-col justify-start items-start">
        {/* button cluster */}
        <div className="w-full flex flex-row justify-center fixed md:sticky p-2 top-14 z-20 backdrop-blur-2xl shrink-0">
          <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-16 md:h-14 p-2 gap-2 dark:border dark:border-base-content/10 rounded-2xl md:rounded-xl overflow-x-auto">
            {/* produk */}
            <ButtonCluster
              isActive={isActiveCluster === "produk"}
              label="Produk"
              handleActive={() => handleActiveCluster("produk")}
            />
            {/* kategori */}
            <ButtonCluster
              isActive={isActiveCluster === "kategori"}
              label="Kategori"
              handleActive={() => handleActiveCluster("kategori")}
            />
            {/* spesifikasi */}
            <ButtonCluster
              isActive={isActiveCluster === "spesifikasi"}
              label="Spesifikasi"
              handleActive={() => handleActiveCluster("spesifikasi")}
            />
          </div>
        </div>

        {/* content */}
        <div className="w-full flex justify-center items-start px-2.5 mt-1 pt-20 md:pt-0 md:mt-0">
          {isActiveCluster === "produk" && (
            <DaftarProduk handleSetToast={handleSetToast} />
          )}

          {isActiveCluster === "kategori" && (
            <KategoriCluster
              handleSetToast={handleSetToast}
              handleSetAlert={handleSetAlert}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Produk;
