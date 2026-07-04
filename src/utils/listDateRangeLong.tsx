import { format } from "date-fns";

const now = new Date();

const listDateRangeLong: { label: string; value: string }[] = [
  {
    label: "1 Bulan",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "3 Bulan",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "6 Bulan",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "1 Tahun",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "2 Tahun",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
];

export default listDateRangeLong;
