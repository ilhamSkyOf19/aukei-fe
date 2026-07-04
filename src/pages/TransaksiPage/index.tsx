import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Transaksi from "../../views/owner/Transaksi";

const TransaksiPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Riwayat Transaksi");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Transaksi | AUKEI" />

      {/* view login */}
      <Transaksi />
    </>
  );
};

export default TransaksiPage;
