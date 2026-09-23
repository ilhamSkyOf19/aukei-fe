import { useEffect } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import { useOutletContext } from "react-router-dom";
import type { OutletContextType } from "../../types/constant.type";
import Pembayaran from "../../views/kasir/Kasir/Pembayaran";

const UbahPembayaranPage = () => {
  // get context
  const { handleTitle } = useOutletContext<OutletContextType>();

  useEffect(() => {
    handleTitle("Ubah Pembayaran");
  }, [handleTitle]);

  return (
    <>
      {/* header page */}
      <HeaderPage title={"Ubah Pembayaran Transaksi | AUKEI"} />

      {/* view toko */}
      <Pembayaran ubahPembayaran />
    </>
  );
};

export default UbahPembayaranPage;
