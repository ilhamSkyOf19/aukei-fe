import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import Produk from "../../views/owner/Produk";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";

const ProdukPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Produk");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Produk | AUKEI" />

      {/* view login */}
      <Produk />
    </>
  );
};

export default ProdukPage;
