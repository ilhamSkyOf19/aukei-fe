const SATUAN = [
  "",
  "Satu",
  "Dua",
  "Tiga",
  "Empat",
  "Lima",
  "Enam",
  "Tujuh",
  "Delapan",
  "Sembilan",
  "Sepuluh",
  "Sebelas",
];

function konversi(n: number): string {
  if (n < 12) {
    return SATUAN[n];
  }
  if (n < 20) {
    return `${konversi(n - 10)} Belas`;
  }
  if (n < 100) {
    const sisa = n % 10;
    return `${konversi(Math.floor(n / 10))} Puluh${sisa ? ` ${konversi(sisa)}` : ""}`;
  }
  if (n < 200) {
    return `Seratus${n - 100 ? ` ${konversi(n - 100)}` : ""}`;
  }
  if (n < 1000) {
    const sisa = n % 100;
    return `${konversi(Math.floor(n / 100))} Ratus${sisa ? ` ${konversi(sisa)}` : ""}`;
  }
  if (n < 2000) {
    const sisa = n % 1000;
    return `Seribu${sisa ? ` ${konversi(sisa)}` : ""}`;
  }
  if (n < 1_000_000) {
    const sisa = n % 1000;
    return `${konversi(Math.floor(n / 1000))} Ribu${sisa ? ` ${konversi(sisa)}` : ""}`;
  }
  if (n < 1_000_000_000) {
    const sisa = n % 1_000_000;
    return `${konversi(Math.floor(n / 1_000_000))} Juta${sisa ? ` ${konversi(sisa)}` : ""}`;
  }
  if (n < 1_000_000_000_000) {
    const sisa = n % 1_000_000_000;
    return `${konversi(Math.floor(n / 1_000_000_000))} Milyar${sisa ? ` ${konversi(sisa)}` : ""}`;
  }
  // Fallback untuk angka yang sangat besar (di luar kebutuhan nominal struk).
  const sisa = n % 1_000_000_000_000;
  return `${konversi(Math.floor(n / 1_000_000_000_000))} Triliun${sisa ? ` ${konversi(sisa)}` : ""}`;
}

/**
 * Fungsi utama yang dipanggil dari view.
 * Contoh: terbilang(6750000) -> "Enam Juta Tujuh Ratus Lima Puluh Ribu Rupiah"
 */
export function terbilang(nominal: number): string {
  const bulat = Math.max(0, Math.round(nominal));
  if (bulat === 0) {
    return "Nol Rupiah";
  }
  // Rapikan spasi ganda yang mungkin muncul dari rekursi lalu tambahkan "Rupiah".
  const teks = konversi(bulat).replace(/\s+/g, " ").trim();
  return `${teks} Rupiah`;
}
