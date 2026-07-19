import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Kredit from "../../views/all/Kredit";

const KreditPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Kredit");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Kredit | AUKEI" />

      {/* view toko */}
      <Kredit />
    </>
  );
};

export default KreditPage;
