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

export const formatNumber = (value: string) => {
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
