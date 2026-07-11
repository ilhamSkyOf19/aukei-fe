import useSizeWindows from "../../../hooks/useSizeWindows";
import { useQuery } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { StatistikServices } from "../../../services/statistik.service";

const useStatistikDetail = () => {
  // window size
  const windowSize = useSizeWindows();

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
    statistik,
    isLoading,
  };
};

export default useStatistikDetail;
