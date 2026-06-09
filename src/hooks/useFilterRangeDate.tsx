import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const DateSchema = z.iso.date();

const useFilterRangeDate = () => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const startDate =
      startDateParam && DateSchema.safeParse(startDateParam).success
        ? startDateParam
        : "";

    const endDate =
      endDateParam && DateSchema.safeParse(endDateParam).success
        ? endDateParam
        : "";

    return {
      startDate,
      endDate,
    };
  }, [searchParams]);
};

export default useFilterRangeDate;
