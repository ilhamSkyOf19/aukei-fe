import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import RiwayatTransaksi from "../../views/owner/RiwayatTransaksi";

const RiwayatTransaksiPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Riwayat Transaksi");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Riwayat Transaksi | AUKEI" />

      {/* view login */}
      <RiwayatTransaksi />
    </>
  );
};

export default RiwayatTransaksiPage;
