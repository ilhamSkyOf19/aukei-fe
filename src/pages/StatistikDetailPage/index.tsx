import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import StatistikDetail from "../../views/owner/StatistikDetail";

const StatistikDetailPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Statistik");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Statistik | AUKEI" />

      {/* view login */}
      <StatistikDetail />
    </>
  );
};

export default StatistikDetailPage;
