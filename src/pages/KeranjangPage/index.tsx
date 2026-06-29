import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Keranjang from "../../views/kasir/Keranjang";

const KeranjangPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Keranjang");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Keranjang | AUKEI" />

      {/* view toko */}
      <Keranjang />
    </>
  );
};

export default KeranjangPage;
