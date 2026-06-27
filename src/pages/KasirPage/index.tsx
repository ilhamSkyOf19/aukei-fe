import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Kasir from "../../views/kasir/Kasir";

const KasirPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Kasir");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Kasir | AUKEI" />

      {/* view toko */}
      <Kasir />
    </>
  );
};

export default KasirPage;
