import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import Produk from "../../views/owner/Produk";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import ReturBarang from "../../views/kasir/ReturBarang";

const ReturBarangPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Retur Barang");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Retur Barang | AUKEI" />

      {/* view login */}
      <ReturBarang />
    </>
  );
};

export default ReturBarangPage;
