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

// format waktu untuk notifikasi
export const formatWaktu = (dateInput: Date | string): string => {
  const date = new Date(dateInput);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffDays =
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24);

  // jika hari ini
  if (diffDays === 0) {
    if (diffMinutes === 0) {
      return "Baru";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    }

    return `${diffHours} jam`;
  }

  // jika kemarin
  if (diffDays === 1) {
    return "Kemarin";
  }

  // jika lebih dari 1 hari
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
