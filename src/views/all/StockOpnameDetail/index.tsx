import type { FC } from "react";

import Alert from "../../../components/messages/Alert";
import Toast from "../../../components/messages/Toast";

import { ALERT_CONFIG_STOCK_OPNAME_DETAIL } from "../../../types/alert.types";

import { TOAST_CONFIG_STOCK_OPNAME_DETAIL } from "../../../types/toast.type";

import { cn } from "../../../utils/cn";

import useStockOpnameDetail from "./useStockOpnameDetail";

import InformasiStockOpnameDetail from "./InformasiStockOpnameDetail";
import ShowStockOpname from "./ShowStockOpnameDetail";

type Props = {
  fromPengajuan?: boolean;
};

const StockOpnameDetail: FC<Props> = ({ fromPengajuan }) => {
  const {
    pengguna,

    // ALERT
    alert,
    handleSetAlert,

    // TOAST
    toast,
    handleSetToast,
    stockOpnameIdFromParams,
    dataRef,
    setDataRef,
    refreshDaftarProdukStockOpname,
    showStockRef,
  } = useStockOpnameDetail();

  return (
    <main className="w-full">
      <div
        className={cn(
          "flex w-full flex-col justify-start items-start gap-2.5 p-2.5",
        )}
      >
        {/* ============================================================
        ALERT
        ============================================================ */}

        {alert && (
          <Alert
            alert={alert.id !== null}
            isAnimationOut={alert.isAnimationOut || false}
            label={ALERT_CONFIG_STOCK_OPNAME_DETAIL[alert.type].message}
          />
        )}

        {/* ============================================================
        TOAST
    ============================================================ */}

        {toast && (
          <Toast
            toast={toast.id !== null}
            isAnimationOut={toast.isAnimationOut || false}
            label={TOAST_CONFIG_STOCK_OPNAME_DETAIL[toast.type].message}
            color={TOAST_CONFIG_STOCK_OPNAME_DETAIL[toast.type].color}
          />
        )}

        <InformasiStockOpnameDetail
          handleSetToast={handleSetToast}
          idStockOpnameDetail={stockOpnameIdFromParams}
          fromPengajuan={fromPengajuan}
          handleSetAlert={handleSetAlert}
          pengguna={pengguna}
          alert={alert}
          handleSetData={setDataRef}
          refreshDaftarProdukStockOpname={refreshDaftarProdukStockOpname}
        />

        {/* ============================================================
        DATA PRODUK
    ============================================================ */}

        <ShowStockOpname
          ref={showStockRef}
          isCanUpdate={dataRef?.isCanUpdate}
          status={dataRef?.status}
          handleSetToast={handleSetToast}
          role={pengguna?.role}
          stockOpnameId={stockOpnameIdFromParams}
          produkIdChoose={dataRef?.produkIdChoose ?? []}
        />

        {/* ============================================================
        MODAL CONFIRM SETUJU
    ============================================================ */}
      </div>
    </main>
  );
};

export default StockOpnameDetail;
