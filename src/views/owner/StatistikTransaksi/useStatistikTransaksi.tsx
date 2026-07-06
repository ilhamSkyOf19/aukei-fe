import { useNavigate } from "react-router-dom";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { useQuery } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { TransactionServices } from "../../../services/transaction.service";

const useStatistikTransaksi = () => {
  // window size
  const windowSize = useSizeWindows();

  // naviagte
  const navigate = useNavigate();

  // filter date
  const { startDate, endDate } = useFilterRangeDate();

  // use query
  const { data: statistik, isLoading: isLoading } = useQuery({
    queryKey: ["statistik", startDate, endDate],
    queryFn: () =>
      TransactionServices.findStatistikWithPersentase({
        startDate,
        endDate,
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // is existing data
  const isExistingData: boolean = !!statistik?.data;

  return {
    windowSize,
    navigate,
    statistik,
    isLoading,
    isExistingData,
  };
};

export default useStatistikTransaksi;
