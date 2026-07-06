import { useState } from "react";
import { getDateTicks } from "../../../helpers/helpers";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useQueries } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";

// get ticks
const dates = getDateTicks("2021-06-01", "2023-06-04");
const dataRaw = dates.map((date) => ({
  date: date,
  value: Math.floor(Math.random() * 10000000),
}));

const useGrafikLine = () => {
  // state isChoose grafik
  const [isChoose, setIsChoose] = useState<string>("omzet");

  // date
  const { endDate, startDate } = useFilterRangeDate();

  // use queries
  const data = useQueries({
    queries: [
      {
        queryKey: ["chart-omzet", startDate, endDate],
        queryFn: () =>
          TransactionServices.chartOmzet({
            startDate,
            endDate,
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "omzet",
      },
    ],
  });

  const [{ data: dataOmzet, isLoading: isLoadingOmzet }] = data;

  const [raw, setRaw] = useState(dataOmzet?.data || []);

  //   handle set is choose
  const handleSetIsChoose = (value: string) => {
    if (value === "omzet") setRaw(dataOmzet?.data || []);
    else setRaw(dataRaw);
    setIsChoose(value);
  };

  return {
    isChoose,
    handleSetIsChoose,
    isLoadingOmzet,
    raw,
  };
};

export default useGrafikLine;
