import { useEffect, type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import DaftarReturBarang from "../../views/all/DaftarReturBarang";

const DaftarReturBarangPage: FC = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Daftar Retur Barang");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title="Daftar Retur Barang | AUKEI" />

      {/* view toko */}
      <DaftarReturBarang />
    </>
  );
};

export default DaftarReturBarangPage;
