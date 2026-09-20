import { useState } from "react";
import type { ResponseDaftarLaporanProdukDetailByKategoriType } from "../../../models/statistik.model";

type HitungType = "OMZET" | "LABA" | "SEMUA";

type HasilHitung = {
  jumlahProduk: number;
  totalOmzet: number;
  totalLaba: number;
};

const useModalHitungPendapatanProduk = (params: {
  dataChooses: ResponseDaftarLaporanProdukDetailByKategoriType[];
  handleCloseModal: () => void;
}) => {
  const { dataChooses } = params;

  // ==========================================
  // PILIHAN JENIS PERHITUNGAN
  // ==========================================

  const [hitungType, setHitungType] = useState<HitungType>("SEMUA");

  // ==========================================
  // HASIL PERHITUNGAN
  // ==========================================

  const [hasilHitung, setHasilHitung] = useState<HasilHitung | null>(null);

  const handleHitungProduk = () => {
    const totalOmzet = dataChooses.reduce(
      (total, item) => total + Number(item.totalOmzet ?? 0),
      0,
    );

    const totalLaba = dataChooses.reduce(
      (total, item) => total + Number(item.totalLaba ?? 0),
      0,
    );

    setHasilHitung({
      jumlahProduk: dataChooses.length,
      totalOmzet,
      totalLaba,
    });
  };

  //   handle reset
  const handleReset = () => {
    setHitungType("SEMUA");
    setHasilHitung(null);
  };

  return {
    hitungType,
    setHitungType,
    handleHitungProduk,
    hasilHitung,
    handleReset,
  };
};

export default useModalHitungPendapatanProduk;
