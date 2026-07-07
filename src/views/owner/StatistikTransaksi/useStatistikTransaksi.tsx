import { useNavigate } from "react-router-dom";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { useQuery } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { StatistikServices } from "../../../services/statistik.service";

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
      StatistikServices.findStatistikWithPersentase({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
  });

  return {
    windowSize,
    navigate,
    statistik,
    isLoading,
  };
};

export default useStatistikTransaksi;
