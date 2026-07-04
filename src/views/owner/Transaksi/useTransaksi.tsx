import { useFilter } from "../../../hooks/useFilter";

const useTransaksi = () => {
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

  return {
    metodePembayaran,
    handleSetMetodePembayaran,
    setTempo,
  };
};

export default useTransaksi;
