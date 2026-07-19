import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import KreditDetail from "../../views/all/KreditDetail";

const KreditDetailPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Kredit Detail");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Kredit Detail | AUKEI" />

      {/* view toko */}
      <KreditDetail />
    </>
  );
};

export default KreditDetailPage;
