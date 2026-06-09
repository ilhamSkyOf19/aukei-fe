import { format } from "date-fns";

const now = new Date();

const listDateRange: { label: string; value: string }[] = [
  {
    label: "Kemarin",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        "yyyy-MM-dd",
      ),
      endDate: format(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        "yyyy-MM-dd",
      ),
    }),
  },
  {
    label: "7 Hari Terakhir",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "30 Hari Terakhir",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "Bulan Ini",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth(), 1),
        "yyyy-MM-dd",
      ),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "Bulan Lalu",
    value: JSON.stringify({
      startDate: format(
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        "yyyy-MM-dd",
      ),
      endDate: format(
        new Date(now.getFullYear(), now.getMonth(), 0),
        "yyyy-MM-dd",
      ),
    }),
  },
  {
    label: "Tahun Ini",
    value: JSON.stringify({
      startDate: format(new Date(now.getFullYear(), 0, 1), "yyyy-MM-dd"),
      endDate: format(now, "yyyy-MM-dd"),
    }),
  },
  {
    label: "Tahun Lalu",
    value: JSON.stringify({
      startDate: format(new Date(now.getFullYear() - 1, 0, 1), "yyyy-MM-dd"),
      endDate: format(new Date(now.getFullYear() - 1, 11, 31), "yyyy-MM-dd"),
    }),
  },
  {
    label: "Semua",
    value: "reset",
  },
];

export default listDateRange;
