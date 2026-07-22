import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import TransactionDetail from "../../views/all/TransactionDetail";

const TransactionDetailPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Detail Transaksi");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Detail Transaksi | AUKEI" />

      {/* view login */}
      <TransactionDetail />
    </>
  );
};

export default TransactionDetailPage;
