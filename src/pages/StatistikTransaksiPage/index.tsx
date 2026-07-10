import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import StatistikTransaksi from "../../views/owner/StatistikTransaksi";

const StatistikTransaksiPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Statistik Transaksi");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Statistik Transaksi | AUKEI" />

      {/* view login */}
      <StatistikTransaksi />
    </>
  );
};

export default StatistikTransaksiPage;
