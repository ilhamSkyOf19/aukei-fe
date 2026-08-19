import { formatTanggalPanjang } from "../helpers/formatDate";
import {
  formatRupiah,
  isReminderNeeded,
  normalizeNoHp,
} from "../helpers/helpers";
import { terbilang } from "../helpers/terbilang";
import type { IPelangganType } from "../models/pelanggan.model";
import type { TempoStatusType } from "../types/constant.type";
function buildWaMessage(
  params: Pick<IPelangganType, "nama"> & {
    tglJatuhTempo: Date;
    nominal: number;
    status: TempoStatusType;
  },
) {
  const { nama, nominal, status, tglJatuhTempo } = params;

  const wave = String.fromCodePoint(0x1f44b);
  const calendar = String.fromCodePoint(0x1f4c5);
  const money = String.fromCodePoint(0x1f4b0);
  const pray = String.fromCodePoint(0x1f64f);

  const tanggal = formatTanggalPanjang(tglJatuhTempo);

  const selisihHari = isReminderNeeded({ tanggalJatuhTempo: tglJatuhTempo });

  // Sudah melewati jatuh tempo
  if (status === "OVERDUE" || selisihHari < 0) {
    return `Halo ${nama} ${wave}

Yth. Bapak/Ibu ${nama},

Kami ingin menginformasikan bahwa tagihan Anda telah melewati tanggal jatuh tempo.

${calendar} Tanggal Jatuh Tempo : ${tanggal}
${money} Nominal Tagihan : Rp${formatRupiah(nominal)}
Terbilang : _${terbilang(nominal)}_

Mohon kiranya pembayaran dapat dilakukan sesegera mungkin.

Apabila pembayaran telah dilakukan, mohon mengabaikan pesan ini atau melakukan konfirmasi kepada kami agar dapat segera kami lakukan verifikasi.

Atas perhatian dan kerja samanya, kami ucapkan terima kasih ${pray}

Hormat kami,
Toko AUKEI`;
  }

  // Jatuh tempo hari ini
  if (selisihHari === 0) {
    return `Halo ${nama} ${wave}

Yth. Bapak/Ibu ${nama},

Kami ingin mengingatkan bahwa tagihan Anda telah memasuki tanggal jatuh tempo hari ini.

${calendar} Tanggal Jatuh Tempo : ${tanggal}
${money} Nominal Tagihan : ${formatRupiah(nominal)}
Terbilang : _${terbilang(nominal)}_

Mohon kiranya pembayaran dapat dilakukan hari ini untuk menyelesaikan tagihan tersebut.

Apabila pembayaran telah dilakukan, mohon mengabaikan pesan ini atau melakukan konfirmasi kepada kami agar dapat segera kami lakukan verifikasi.

Atas perhatian dan kerja samanya, kami ucapkan terima kasih ${pray}

Hormat kami,
Toko AUKEI`;
  }

  // H-1, H-2, H-3
  const keteranganHari =
    selisihHari === 1 ? "besok" : `${selisihHari} hari lagi`;

  return `Halo ${nama} ${wave}

Yth. Bapak/Ibu ${nama},

Kami ingin mengingatkan bahwa tagihan Anda akan jatuh tempo ${keteranganHari}.

${calendar} Tanggal Jatuh Tempo : ${tanggal}
${money} Nominal Tagihan : ${formatRupiah(nominal)}
Terbilang : _${terbilang(nominal)}_

Mohon kiranya pembayaran dapat dilakukan sebelum atau pada tanggal jatuh tempo tersebut untuk menjaga kelancaran administrasi pembayaran.

Apabila pembayaran telah dilakukan, mohon mengabaikan pesan ini ${pray}

Atas perhatian dan kerja samanya, kami ucapkan terima kasih.

Hormat kami,
Toko AUKEI`;
}

function buildWaLink(params: { noWa: string; pesan: string }) {
  return `https://api.whatsapp.com/send?phone=${params.noWa}&text=${encodeURIComponent(
    params.pesan,
  )}`;
}

export const kirimWA = (
  params: Pick<IPelangganType, "nama" | "noWa"> & {
    tglJatuhTempo: Date;
    nominal: number;
    status: TempoStatusType;
  },
) => {
  const { nama, noWa, nominal, status, tglJatuhTempo } = params;

  const pesan = buildWaMessage({ nama, nominal, status, tglJatuhTempo });
  const link = buildWaLink({ noWa: normalizeNoHp(noWa), pesan });
  window.open(link, "_blank");
};
