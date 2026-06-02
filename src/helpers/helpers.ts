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
export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
