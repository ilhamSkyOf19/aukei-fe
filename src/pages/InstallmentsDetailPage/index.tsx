import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import { useEffect } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import InstallmentsDetail from "../../views/all/InstallmentsDetail";

const InstallmentsDetailPage = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Installments Detail");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Installments Detail | AUKEI" />

      {/* view toko */}
      <InstallmentsDetail />
    </>
  );
};

export default InstallmentsDetailPage;
