import { useNavigate } from "react-router-dom";
import { useFilter } from "../../../hooks/useFilter";
import useSizeWindows from "../../../hooks/useSizeWindows";

const useTransaksi = () => {
  // window size
  const windowSize = useSizeWindows();

  // navigate
  const navigate = useNavigate();

  // filter metode pembayaran
  const { filter: metodePembayaran, setFilter: handleSetMetodePembayaran } =
    useFilter({
      paramName: "metode-pembayaran",
      allowQuery: ["semua", "CASH", "TRANSFER", "QRIS", "TEMPO"],
      defaultValueCustom: "semua",
    });

  // filter status tempo
  const { filter: tempo, setFilter: setTempo } = useFilter({
    paramName: "status-tempo",
    allowQuery: ["semua", "UNPAID", "PAID", "OVERDUE"],
    defaultValueCustom: "semua",
  });

  // handle detail
  const handleRedirectDetail = () => {
    navigate(`/dashboard/transaksi/statistik`);
  };

  return {
    metodePembayaran,
    handleSetMetodePembayaran,
    setTempo,
    windowSize,
    handleRedirectDetail,
  };
};

export default useTransaksi;
