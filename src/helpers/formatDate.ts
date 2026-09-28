// format tanggal contoh : 11 Januari 2026
export const formatTanggalPanjang = (iso: Date | string) => {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTanggalLengkap = (iso: Date | string) => {
  const date = new Date(iso);

  const tanggal = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const waktu = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${tanggal} - ${waktu}`;
};

export const formatTanggalShort = (iso: Date | string) => {
  const date = new Date(iso);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
