import { useParams } from "react-router-dom";

import { useAuthStore } from "../../../stores/authStore";
import { parseId } from "../../../helpers/helpers";

import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";
import { useRef, useState } from "react";
import type { StatusStockOpnameType } from "../../../types/constant.type";
import type { ChildRef } from "../../../types/ref.type";

const useStockOpnameDetail = () => {
  const [dataRef, setDataRef] = useState<{
    status: StatusStockOpnameType;
    isCanUpdate: boolean;
    produkIdChoose: number[];
  } | null>(null);

  const pengguna = useAuthStore((state) => state.pengguna);

  const { id } = useParams<{
    id: string;
  }>();

  const stockOpnameIdFromParams = parseId(id);

  // ============================================================
  // ALERT
  // ============================================================

  const { alert, handleSetAlert } = useAlertAnimation();

  // ============================================================
  // TOAST
  // ============================================================

  const { toast, handleSetToast } = useToastAnimation();

  const showStockRef = useRef<ChildRef | null>(null);

  const refreshDaftarProdukStockOpname = async () => {
    await showStockRef.current?.refetchActive();
  };

  return {
    refreshDaftarProdukStockOpname,
    showStockRef,

    pengguna,

    // ALERT
    alert,
    handleSetAlert,

    // TOAST
    toast,
    handleSetToast,

    // PARAMS
    stockOpnameIdFromParams,

    // DATA REF
    dataRef,
    setDataRef,
  };
};

export default useStockOpnameDetail;
