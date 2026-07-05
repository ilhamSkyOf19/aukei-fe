import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export const highlightName = (name: string) => {
  const words = name.split(" ");

  // check
  if (words.length > 1) {
    return words[0].split("")[0] + words[1].split("")[0];
  } else {
    return words[0].split("")[0];
  }
};

// format rp
export const formatRupiah = (value: number | string): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
};

// generate page numbers
export const generatePageNumbers = (
  current: number,
  total: number,
  windowSize: number,
): (number | "...")[] => {
  if (total <= windowSize + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  const sideCount = Math.floor(windowSize / 2);

  let start = current - sideCount;
  let end = current + sideCount;

  if (start <= 2) {
    start = 2;
    end = start + windowSize - 1;
  }

  if (end >= total - 1) {
    end = total - 1;
    start = end - windowSize + 1;
  }

  pages.push(1);

  if (start > 2) {
    pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
};

// color for stok
export const generateColorForStok = (
  stok: number,
  stokMinimum: number,
): "text-emerald-600" | "text-warning" | "text-error" => {
  if (stok === 0 || stok < 0) {
    return "text-error";
  }

  if (stok > stokMinimum + 10) {
    return "text-emerald-600";
  }

  return "text-warning";
};

// parse id
export const parseId = (value: string | undefined) => {
  const numberValue = Number(value);

  if (!value || Number.isNaN(numberValue) || numberValue <= 0) {
    return null;
  }

  return numberValue;
};

export const formatNumber = (value: string | number) => {
  if (!value) return "";

  return new Intl.NumberFormat("id-ID").format(Number(value));
};

export const unformatNumber = (value: string) => {
  return value.replace(/\D/g, "");
};

export const getCurrentDateTimeLocal = () => {
  const now = new Date();

  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export const expireDateOneDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);

  return newDate;
};

// format number phone
export const formatNumberPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");

  return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8)}`;
};

export const formatNumberPhoneWithDash = (value: string) => {
  const numbers = value.replace(/\D/g, "");

  const parts = [];

  if (numbers.length > 0) {
    parts.push(numbers.slice(0, 4));
  }

  if (numbers.length > 4) {
    parts.push(numbers.slice(4, 8));
  }

  if (numbers.length > 8) {
    parts.push(numbers.slice(8));
  }

  return parts.join(" - ");
};

// handler pagination
export const handlePagination = (params: {
  currentPage?: number | null;
  totalPage?: number | null;
  windowSize?: number;
  setPage: (value: string) => void;
}) => {
  const { currentPage, totalPage, setPage, windowSize } = params;

  const pages = generatePageNumbers(
    currentPage || 1,
    totalPage || 1,
    windowSize || 3,
  );

  const goTo = (page: number) => {
    if (page < 1 || page > (totalPage || 1)) return;
    setPage(String(page));
  };

  const isPrev = (currentPage || 1) > 1;
  const isNext = (currentPage || 1) < totalPage!;

  return {
    pages,
    goTo,
    isPrev,
    isNext,
  };
};

// add days
export const addDaysHandler = (params: { days: number; date: Date }): Date => {
  const { date, days } = params;

  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysFromWeeks = (weeks: number): number => {
  return weeks * 7;
};

export const maxValue = (value: string | number, max: number): string => {
  const num = Number(value) || 0;

  const result = Math.min(num, max);

  return result.toString();
};

export const formatNumberK = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
};

// format rupiah
export const formatRupiahShort = (value: number): string => {
  if (!value) return "Rp 0";

  // Miliar
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(2).replace(".", ",")} M`;
  }

  // Juta
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000)
      .toFixed(3)
      .replace(/\.?0+$/, "")
      .replace(".", ",")} Jt`;
  }

  // Ribu
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0).replace(".", ",")}K`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
};

export const formatRupiahChartValue = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)} jt`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)} rb`;
  }

  return value.toString();
};

export const getDateTicks = (startDate: string, endDate: string): string[] => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const totalDays = differenceInCalendarDays(end, start) + 1;

  // Jika <= 7 hari, tampilkan semua
  if (totalDays <= 7) {
    return Array.from({ length: totalDays }, (_, i) =>
      format(addDays(start, i), "d MMM", {
        locale: id,
      }),
    );
  }

  // Jika > 7 hari, ambil 7 titik
  const result: string[] = [];
  const step = (totalDays - 1) / 6;

  for (let i = 0; i < 7; i++) {
    const dayIndex = Math.round(i * step);

    result.push(
      format(addDays(start, dayIndex), "d MMM yyyy", {
        locale: id,
      }),
    );
  }

  return result;
};
