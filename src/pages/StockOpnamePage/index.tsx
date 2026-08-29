import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import StokOpname from "../../views/all/StockOpname";

const StockOpnamePage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Stok Opname");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Stok Opname | AUKEI" />

      {/* view login */}
      <StokOpname />
    </>
  );
};

export default StockOpnamePage;
