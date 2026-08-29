import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import StockOpnameDetail from "../../views/all/StockOpnameDetail";

const StockOpnameDetailPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Stok Opname Detail");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Stok Opname Detail | AUKEI" />

      {/* view login */}
      <StockOpnameDetail />
    </>
  );
};

export default StockOpnameDetailPage;
