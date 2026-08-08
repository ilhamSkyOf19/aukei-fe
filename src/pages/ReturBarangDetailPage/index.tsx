import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import ReturBarangDetail from "../../views/all/ReturBarangDetail";

const ReturBarangDetailPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Retur Barang Detail");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Retur Barang Detail | AUKEI" />

      {/* view login */}
      <ReturBarangDetail />
    </>
  );
};

export default ReturBarangDetailPage;
