import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import RiwayatTransaksiDetail from "../../views/owner/RiwayatTransaksiDetail";

const RiwayatTransaksiDetailPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Riwayat Transaksi Detail");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Riwayat Transaksi Detail | AUKEI" />

      {/* view login */}
      <RiwayatTransaksiDetail />
    </>
  );
};

export default RiwayatTransaksiDetailPage;
